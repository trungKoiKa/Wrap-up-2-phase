import type { Question } from '../types'

export const part2: Question[] = [
  {
    id: '43', part: 2, type: 'single',
    prompt: 'Luật Trí Tuệ Nhân Tạo Việt Nam 2025 yêu cầu gì đối với high-risk AI systems?',
    answer: 'Đánh giá rủi ro trước khi deploy, logging và audit trail, transparency với người dùng (phải biết đây là AI), human oversight cho quyết định quan trọng',
    distractors: [
      'Chỉ cần đăng ký tên miền, không có yêu cầu nào khác',
      'Cấm hoàn toàn mọi hệ thống AI trong doanh nghiệp',
      'Chỉ yêu cầu mã nguồn mở, không cần đánh giá rủi ro',
    ],
  },
  {
    id: '44', part: 2, type: 'single',
    prompt: 'Khi present AI project cho C-suite, frame nào hiệu quả nhất?',
    answer: 'Frame theo business outcomes: cost savings, revenue impact, risk reduction — với số liệu và timeline cụ thể',
    distractors: [
      'Giải thích chi tiết kiến trúc transformer và các hyperparameter',
      'Tập trung vào demo công nghệ mới nhất, bỏ qua con số',
      'Nêu độ chính xác (accuracy) của model là đủ',
    ],
  },
  {
    id: '45', part: 2, type: 'single',
    prompt: 'Hidden assumptions trong first product definition nguy hiểm vì sao?',
    answer: 'Assumptions ngầm không được test → build product cho thị trường không tồn tại hoặc sai target segment',
    distractors: [
      'Vì chúng làm tăng chi phí cloud hằng tháng',
      'Vì chúng khiến model train chậm hơn',
      'Vì chúng luôn vi phạm quy định pháp luật',
    ],
  },
  {
    id: '46', part: 2, type: 'single',
    prompt: 'Tại sao AI adoption trong enterprise thường chậm hơn kỳ vọng?',
    answer: 'Change management: người dùng lo mất việc, thiếu training, workflow integration phức tạp và trust building cần thời gian',
    distractors: [
      'Vì model AI hiện nay chưa thể chạy trên cloud',
      'Vì doanh nghiệp luôn thiếu GPU để mua',
      'Vì AI không thể áp dụng cho bất kỳ quy trình nào có sẵn',
    ],
  },
  {
    id: '47', part: 2, type: 'single',
    prompt: 'Market analysis cho AI product cần tập trung vào điều gì ngoài market size?',
    answer: 'Timing (thị trường đã ready chưa?), competition moats, customer adoption barriers và regulatory landscape',
    distractors: [
      'Chỉ cần số lượng follower trên mạng xã hội của đối thủ',
      'Chỉ cần tên model đối thủ đang dùng',
      'Không cần gì thêm, market size là đủ',
    ],
  },
  {
    id: '48', part: 2, type: 'single',
    prompt: 'Khi build financial model cho AI investment, baseline quan trọng nhất cần establish là gì?',
    answer: 'Current cost/time của process sẽ bị AI thay thế — để tính delta (savings/improvements)',
    distractors: [
      'Giá cổ phiếu của nhà cung cấp model',
      'Số lượng tham số của model được chọn',
      'Chi phí marketing của đối thủ',
    ],
  },
  {
    id: '49', part: 2, type: 'single',
    prompt: 'EU AI Act phân loại AI systems thành mấy risk levels?',
    answer: '4 cấp: Minimal/No risk, Limited risk, High risk, Unacceptable risk',
    distractors: [
      '2 cấp: Allowed và Banned',
      '3 cấp: Low, Medium, High',
      '5 cấp: Từ Level 1 đến Level 5 theo số tham số model',
    ],
  },
  {
    id: '51', part: 2, type: 'single',
    prompt: 'Khác biệt cốt lõi giữa AI roadmap và Software roadmap truyền thống là gì?',
    answer: 'AI roadmap bất định cao (probabilistic) vì phụ thuộc chất lượng data và độ chính xác model, bắt buộc có phase PoC và Eval Gate trước khi scale; phần mềm truyền thống là deterministic',
    distractors: [
      'AI roadmap luôn nhanh hơn vì không cần test',
      'Hai loại roadmap hoàn toàn giống nhau',
      'AI roadmap không cần data, chỉ cần chọn model',
    ],
  },
  {
    id: '54', part: 2, type: 'single',
    prompt: '"Output contract" trong thiết kế LLM app là gì và đóng vai trò gì?',
    answer: 'Thỏa thuận cấu trúc dữ liệu đầu ra chặt chẽ (vd JSON Schema) mà LLM phải tuân theo, giúp hệ thống downstream (frontend, API, DB) parse an toàn mà không crash khi model sinh chữ ngẫu hứng',
    distractors: [
      'Hợp đồng pháp lý giữa công ty và nhà cung cấp model về giá',
      'Giới hạn số token tối đa mà người dùng được dùng mỗi ngày',
      'Danh sách câu hỏi mà model được phép từ chối',
    ],
  },
  {
    id: '56', part: 2, type: 'single',
    prompt: 'Feedback thu từ 3 nguồn: web form (chỉ hiện khi bấm "Báo sự cố"), mobile app (sau mỗi interaction), email (khi khiếu nại). Kết quả 65% Negative trong khi CSKH báo 78% hài lòng. Nguyên nhân chính?',
    answer: 'Selection bias — web form và email chỉ capture negative feedback (triggered by problems); kết quả không đại diện toàn bộ khách hàng',
    distractors: [
      'Model sentiment bị overfit',
      'CSKH báo cáo sai số liệu một cách cố ý',
      'Sample size quá lớn nên bị nhiễu',
    ],
  },
  {
    id: '58', part: 2, type: 'fill',
    prompt: 'ROI Logistics: CSKH 8 người × 12 triệu/tháng = 96 triệu. 1.200 ticket/ngày × 6 phút. AI tự giải quyết 60% (0 phút), 40% còn lại giảm 6→3 phút. Chi phí vận hành AI 15 triệu/tháng. Cost Saving ròng hàng tháng = ______ triệu.',
    answers: ['61.8', '61,8'],
    explanation:
      'Thời gian cũ/ngày: 1.200 × 6 = 7.200 phút.\nThời gian mới/ngày: 40% × 1.200 × 3 = 1.440 phút.\nTiết kiệm: 5.760 phút/ngày = 80%.\nGiá trị tiết kiệm: 80% × 96 = 76,8 triệu/tháng.\nCost Saving ròng = 76,8 − 15 = 61,8 triệu/tháng.',
  },
  {
    id: '59', part: 2, type: 'multi',
    prompt: 'ROI Logistics (tiếp): chọn 2 chi phí ẩn/rủi ro CHƯA được tính trong mô hình.',
    answers: [
      'Chi phí đào tạo nhân viên CSKH làm quen quy trình phối hợp cùng AI',
      'Chi phí xử lý sai số & kiểm soát chất lượng (duyệt lại ca AI trả lời sai, bồi thường khi AI tư vấn sai chính sách)',
    ],
    distractors: [
      'Chi phí vận hành AI hằng tháng 15 triệu',
      'Chi phí xây dựng ban đầu 200 triệu',
    ],
    explanation: 'Hai chi phí vận hành/xây dựng đã có trong đề, nên không phải chi phí ẩn.',
  },
  {
    id: '60', part: 2, type: 'fill',
    prompt: 'ROI Logistics (tiếp): Chi phí xây dựng 200 triệu (1 lần) + vận hành 15 triệu × 12 = 380 triệu. Giá trị tiết kiệm 76,8 × 12 = 921,6 triệu. ROI sau 1 năm = ______ %.',
    answers: ['142.5', '142,5'],
    explanation: 'ROI = (921,6 − 380) / 380 × 100% = 142,5%. Lợi nhuận ròng 541,6 triệu; payback khoảng 4–5 tháng → RẤT ĐÁNG ĐẦU TƯ.',
  },
  {
    id: '61', part: 2, type: 'open',
    prompt: 'ROI Logistics (tổng kết): Trình bày đầy đủ cách tính Cost Saving hàng tháng, ROI sau 1 năm và kết luận có nên đầu tư không.',
    modelAnswer:
      '• Thời gian cũ: 1.200 × 6 = 7.200 phút/ngày. Mới: 40% × 1.200 × 3 = 1.440 phút. Tiết kiệm 5.760 phút (80%).\n' +
      '• Lương CSKH: 8 × 12 = 96 triệu/tháng → tiết kiệm 80% × 96 = 76,8 triệu/tháng.\n' +
      '• Cost Saving ròng = 76,8 − 15 = 61,8 triệu/tháng.\n' +
      '• Chi phí 1 năm = 200 + 15 × 12 = 380 triệu. Giá trị tạo ra = 76,8 × 12 = 921,6 triệu.\n' +
      '• Lợi nhuận ròng = 541,6 triệu; ROI = (921,6 − 380) / 380 = 142,5%.\n' +
      '• Kết luận: RẤT ĐÁNG ĐẦU TƯ, payback ~4–5 tháng.\n' +
      '• Chi phí ẩn: đào tạo nhân viên; xử lý sai số & kiểm soát chất lượng.',
  },
]
