import type { Question } from '../types'

export const part3: Question[] = [
  {
    id: '62', part: 3, type: 'single',
    prompt: 'Khi chọn GPU instance type cho LLM inference trên cloud, yếu tố quyết định nhất là gì?',
    answer: 'VRAM (GPU memory) — phải đủ chứa model weights + KV cache cho concurrent requests',
    distractors: [
      'Màu sắc và thương hiệu của instance',
      'Số lõi CPU của máy chủ',
      'Dung lượng ổ cứng HDD',
    ],
  },
  {
    id: '63', part: 3, type: 'single',
    prompt: 'Các threat vectors đặc thù cho AI infrastructure (không có trong traditional app) là gì?',
    answer: 'Model extraction, training data poisoning, adversarial examples và supply chain attacks (compromised model weights)',
    distractors: [
      'SQL injection, XSS, CSRF',
      'Chỉ DDoS và brute-force mật khẩu',
      'Lỗi tràn bộ đệm (buffer overflow) và phishing',
    ],
  },
  {
    id: '64', part: 3, type: 'single',
    prompt: 'Data Observability khác với Application Observability ở điểm gì?',
    answer: 'Data Observability monitor health của data pipelines và data quality (freshness, completeness, schema changes) — không chỉ infra',
    distractors: [
      'Data Observability chỉ đo CPU/RAM của server',
      'Data Observability chỉ ghi log lỗi HTTP 500',
      'Hai khái niệm hoàn toàn giống nhau',
    ],
  },
  {
    id: '65', part: 3, type: 'single',
    prompt: 'GPU FinOps cho AI workloads: kỹ thuật nào giảm cost nhiều nhất với trade-off thấp nhất?',
    answer: 'Spot instances cho batch/training (fault-tolerant), reserved instances cho production inference (tải đều), và auto-scaling để không idle',
    distractors: [
      'Dùng on-demand cho mọi workload và để GPU chạy 24/7',
      'Dùng spot instances cho production inference nhạy cảm latency',
      'Mua GPU mạnh nhất cho mọi tác vụ dù tải thấp',
    ],
  },
  {
    id: '66', part: 3, type: 'single',
    prompt: 'Quantization (INT8/INT4) trong model serving đánh đổi điều gì?',
    answer: 'Giảm memory footprint và tăng throughput, đổi lấy nhẹ quality degradation — chấp nhận được với nhiều production task',
    distractors: [
      'Tăng chất lượng model, đổi lấy tốn thêm bộ nhớ',
      'Không đánh đổi gì, quality luôn giữ nguyên 100%',
      'Giảm hoàn toàn nhu cầu GPU và latency về 0',
    ],
  },
  {
    id: '67', part: 3, type: 'single',
    prompt: 'Data Lakehouse kết hợp ưu điểm của Data Lake và Data Warehouse như thế nào?',
    answer: 'Storage kiểu Data Lake (raw, linh hoạt, rẻ) + analytics kiểu Data Warehouse (ACID transactions, schema enforcement, query performance)',
    distractors: [
      'Chỉ lưu dữ liệu đã làm sạch, không chấp nhận dữ liệu thô',
      'Lưu toàn bộ dữ liệu trong RAM để truy vấn nhanh',
      'Chỉ dành cho dữ liệu streaming, không hỗ trợ batch',
    ],
  },
  {
    id: '68', part: 3, type: 'single',
    prompt: 'Trong CI/CD pipeline cho AI, "eval gate" hoạt động như thế nào?',
    answer: 'Chạy automated evaluation sau mỗi code/prompt/model change — chỉ cho deploy nếu eval scores vượt thresholds (faithfulness, accuracy, safety)',
    distractors: [
      'Chặn deploy vào chiều thứ Sáu theo lịch cố định',
      'Chỉ kiểm tra cú pháp code, không chạy evaluation',
      'Yêu cầu từng lập trình viên review thủ công mọi câu trả lời của model',
    ],
  },
  {
    id: '69', part: 3, type: 'single',
    prompt: 'Model serving optimization strategies nào giúp giảm latency nhất?',
    answer: 'Batching requests, KV cache, speculative decoding và quantization — kết hợp để giảm TTFT và tăng throughput',
    distractors: [
      'Tăng max_tokens lên tối đa cho mọi request',
      'Tắt KV cache để tiết kiệm bộ nhớ',
      'Xử lý từng request tuần tự trên một thread duy nhất',
    ],
  },
  {
    id: '71', part: 3, type: 'multi',
    prompt: 'Metrics cần monitor cho production agent? (Chọn nhiều)',
    answers: [
      'Latency P50 và P99 của mỗi request',
      'Token cost per request (input + output tokens)',
      'Error rate (tool call failures, JSON parsing errors, timeouts)',
      'Task completion rate (% request đạt Final Answer thành công)',
    ],
    distractors: [
      'Số dòng code của system prompt',
      'Số lượng ký tự emoji trong câu trả lời',
    ],
  },
  {
    id: '72', part: 3, type: 'open',
    prompt:
      'Chunking: "Chính sách hoàn tiền được áp dụng trong vòng 30 ngày kể từ ngày mua. Điều kiện: sản phẩm chưa qua sử dụng và còn nguyên tem." — Hãy đề xuất cách chunk và metadata.',
    modelAnswer:
      'Giữ nguyên 1 semantic chunk chứa trọn thời hạn và điều kiện đi kèm (không cắt đôi câu làm mất ngữ cảnh điều kiện).\n\nMetadata:\n{\n  "source": "refund_policy.pdf",\n  "topic": "hoàn tiền",\n  "category": "chính sách đổi trả",\n  "time_limit_days": 30,\n  "effective_date": "2026-01-01"\n}',
  },
  {
    id: '73', part: 3, type: 'single',
    prompt: 'Vì sao P99 latency quan trọng hơn average latency?',
    answer: 'Average bị bóp méo bởi số đông query ngắn, che giấu các ca nghẽn nghiêm trọng; P99 đo độ trễ mà 1% người dùng xui nhất phải chịu, phản ánh ổn định hệ thống khi tải cao (worst-case)',
    distractors: [
      'P99 luôn thấp hơn average nên đẹp hơn trên báo cáo',
      'Average không thể tính được với dữ liệu lớn',
      'P99 chỉ đo thời gian khởi động server',
    ],
  },
  {
    id: '74', part: 3, type: 'single',
    prompt: 'RAG HR hỏi về "leave advance" ở section 4.3.2 nhưng bot báo không tìm thấy; kiểm tra thấy chunk_size = 3000 tokens. Nguyên nhân?',
    answer: 'Chunk size quá lớn — 1 chunk chứa nhiều sections, semantic signal của "leave advance" bị dilute (pha loãng), retrieval score thấp',
    distractors: [
      'Chunk size quá nhỏ làm mất hết ngữ cảnh',
      'Temperature quá cao khiến bot bịa câu trả lời',
      'Model embedding không hỗ trợ tiếng Anh',
    ],
  },
  {
    id: '76', part: 3, type: 'multi',
    prompt:
      'E-commerce nâng cấp GPT-3.5 → GPT-4o lúc 5h chiều thứ Sáu: latency 800ms → 2.4s, chi phí tăng 6x, vỡ template giao diện. Chọn 3 root causes.',
    answers: [
      'Không có Offline Evaluation Pipeline để đo trước độ trễ, chi phí và format câu trả lời',
      'Không kiểm thử Output Contract / Schema Validation nên vỡ giao diện',
      'Không có staged rollout: deploy thẳng 100% lên production vào chiều thứ Sáu thay vì canary',
    ],
    distractors: [
      'GPT-4o luôn kém hơn GPT-3.5 ở mọi tác vụ',
      'Do người dùng gửi quá nhiều request vào chiều thứ Sáu',
    ],
  },
  {
    id: '77', part: 3, type: 'single',
    prompt: 'Chi phí tăng 6x khi nâng cấp model có chấp nhận được không?',
    answer: 'Không chấp nhận mù quáng: cần xem độ chính xác tăng thêm có làm tăng doanh thu/giảm huỷ đơn không; nếu không thì dùng Model Routing (GPT-4o cho khiếu nại phức tạp, model nhỏ rẻ cho tra cứu đơn hàng)',
    distractors: [
      'Luôn chấp nhận vì model mới chắc chắn tốt hơn',
      'Không bao giờ chấp nhận, phải quay lại model cũ vĩnh viễn',
      'Chỉ cần đàm phán giảm giá với nhà cung cấp là đủ',
    ],
  },
  {
    id: '79', part: 3, type: 'ordering',
    prompt: 'Sắp xếp pipeline CI/CD chuẩn cho AI agent.',
    items: [
      'Code/Prompt commit',
      'Unit test & Schema validation',
      'Eval Gate (Golden Dataset: RAGAS + Latency + Token cost)',
      'Staging deploy',
      'Canary release (5% traffic) + auto-rollback nếu P99/Error rate vượt ngưỡng',
    ],
  },
]
