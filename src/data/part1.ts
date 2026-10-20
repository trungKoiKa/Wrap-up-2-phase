import type { Question } from '../types'

// Đáp án đúng + giải thích lấy từ file docx. Đáp án NHIỄU (distractors) do AI soạn.
export const part1: Question[] = [
  {
    id: '1', part: 1, type: 'single',
    prompt: 'Muốn build hệ thống tự động phân loại email support thành 5 categories. Nhóm AI nào phù hợp nhất?',
    answer: 'Discriminative AI',
    distractors: ['Generative AI', 'Agentic AI', 'Reinforcement Learning thuần'],
    explanation: 'Đây là bài toán phân loại có output cố định (Input → Label) nên chọn Discriminative AI.',
  },
  {
    id: '2', part: 1, type: 'single',
    prompt: 'Tại sao "Garbage In, Garbage Out" quan trọng hơn khi nói về data cho AI agent?',
    answer: 'Data bẩn (OCR lỗi, metadata thiếu, policy cũ) khiến agent hallucinate và trả lời sai dù model mạnh; đổi model đắt hơn không fix được data bẩn',
    distractors: [
      'Vì model càng lớn càng tự động làm sạch được data đầu vào',
      'Vì chỉ cần tăng temperature là bù được data kém chất lượng',
      'Vì data chỉ ảnh hưởng đến tốc độ, không ảnh hưởng đến độ chính xác',
    ],
  },
  {
    id: '3', part: 1, type: 'single',
    prompt: 'Khi expose AI agent như một REST API, những consideration nào quan trọng nhất?',
    answer: 'Authentication/authorization, rate limiting, streaming response, timeout handling và versioning (/v1/)',
    distractors: [
      'Chỉ cần chọn framework nhanh nhất, các vấn đề còn lại để sau',
      'Cho phép truy cập ẩn danh và không giới hạn request để tăng trải nghiệm',
      'Luôn trả toàn bộ response một lần, không dùng streaming và không đặt timeout',
    ],
  },
  {
    id: '4', part: 1, type: 'single',
    prompt: 'Prompt injection attack hoạt động như thế nào?',
    answer: 'User thêm instruction vào input để override system prompt và khiến agent làm việc nguy hiểm',
    distractors: [
      'Kẻ tấn công đánh cắp model weights qua API',
      'Kẻ tấn công làm nhiễm độc dữ liệu training trước khi huấn luyện',
      'Kẻ tấn công làm quá tải server bằng lượng request khổng lồ',
    ],
  },
  {
    id: '6', part: 1, type: 'single',
    prompt: 'Trong Supervisor-worker pattern, Supervisor có trách nhiệm chính là gì?',
    answer: 'Nhận task, route đúng worker và tổng hợp kết quả',
    distractors: [
      'Tự thực thi mọi sub-task, không cần worker',
      'Chỉ lưu log và không tham gia điều phối',
      'Huấn luyện lại model của từng worker sau mỗi request',
    ],
  },
  {
    id: '7', part: 1, type: 'single',
    prompt: 'Agent trả lời đúng fact nhưng là fact CŨ (stale). Symptom này chỉ ra lỗi ở tầng nào?',
    answer: 'Freshness — publish pipeline hoặc cache vector bị stale',
    distractors: [
      'Generation — prompt grounding quá chặt',
      'Chunking — chunk size quá nhỏ',
      'Authentication — token hết hạn',
    ],
  },
  {
    id: '8', part: 1, type: 'single',
    prompt: 'Prompt grounding trong Generation stage nghĩa là gì?',
    answer: 'Hướng dẫn model chỉ trả lời từ retrieved context, citation rõ nguồn và nói "không biết" khi thiếu bằng chứng',
    distractors: [
      'Cho model tự do dùng kiến thức nội tại để trả lời đầy đủ nhất có thể',
      'Tăng temperature để câu trả lời sáng tạo hơn',
      'Rút ngắn prompt tối đa để giảm chi phí token',
    ],
  },
  {
    id: '9', part: 1, type: 'single',
    prompt: 'AI-specific metrics quan trọng nhất cần monitor cho LLM agent là gì?',
    answer: 'TTFT (Time to First Token), Quality score, Cost per request, Drift (model/data)',
    distractors: [
      'Chỉ CPU usage và dung lượng ổ đĩa',
      'Số dòng code và số commit mỗi ngày',
      'Chỉ uptime của server, không cần metric chất lượng',
    ],
  },
  {
    id: '10', part: 1, type: 'single',
    prompt: 'Theo AI Readiness Checklist, bài toán nào phù hợp nhất để dùng AI (Go decision)?',
    answer: 'Phân tích sentiment của 10,000 feedback khách hàng mỗi ngày',
    distractors: [
      'Tính toán lương nhân viên theo công thức cố định',
      'Kiểm tra xem số điện thoại có đủ 10 chữ số hay không',
      'Quyết định pháp lý quan trọng mà không cho phép sai sót và không có người kiểm tra',
    ],
  },
  {
    id: '11', part: 1, type: 'single',
    prompt: 'Semantic caching là cost optimization strategy như thế nào?',
    answer: 'Cache LLM responses cho các query tương đồng về ngữ nghĩa — "hủy đơn hàng" và "cancel order" nhận cùng response',
    distractors: [
      'Chỉ cache khi hai query giống nhau từng ký tự (exact match)',
      'Cache model weights lên GPU để tải nhanh hơn',
      'Lưu toàn bộ lịch sử chat để huấn luyện lại model',
    ],
  },
  {
    id: '12', part: 1, type: 'single',
    prompt: 'Khi đánh giá ROI 3 kịch bản cho AI investment, kịch bản nào thường cho ROI cao nhất nhanh nhất?',
    answer: 'Kịch bản realistic/base case với assumptions rõ ràng và timeline cụ thể',
    distractors: [
      'Kịch bản optimistic với giả định mọi thứ đều thuận lợi',
      'Kịch bản pessimistic vì chi phí được tính thấp nhất',
      'Không kịch bản nào, ROI không thể ước lượng được',
    ],
  },
  {
    id: '13', part: 1, type: 'single',
    prompt: 'Prompt kém: "Viết email cho tôi". Prompt tốt theo framework RTCF là gì?',
    answer: 'Viết email xin lỗi khách hàng về giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ, có CTA rõ ràng',
    distractors: [
      'Viết một email thật hay và dài cho tôi',
      'Viết email, càng sáng tạo càng tốt, không cần quan tâm khách hàng',
      'Email xin lỗi',
    ],
    explanation: 'RTCF = Role, Task, Context, Format.',
  },
  {
    id: '14', part: 1, type: 'truefalse',
    prompt: 'Machine Learning (ML) là một tập con của Deep Learning.',
    answer: false,
    explanation: 'Sai: Deep Learning mới là tập con của Machine Learning.',
  },
  {
    id: '15', part: 1, type: 'truefalse',
    prompt: 'LLM-as-a-Judge có thể thay thế hoàn toàn human evaluation trong mọi trường hợp.',
    answer: false,
    explanation: 'Sai: vẫn cần con người kiểm định các trường hợp nhạy cảm, edge cases.',
  },
  {
    id: '16', part: 1, type: 'truefalse',
    prompt: 'Prompt injection và Jailbreaking là cùng một loại attack, chỉ khác tên gọi.',
    answer: false,
    explanation: 'Sai: Prompt injection là chiếm quyền điều khiển context; Jailbreaking là phá vỡ ranh giới đạo đức/an toàn của LLM.',
  },
  {
    id: '17', part: 1, type: 'truefalse',
    prompt: 'Trong RAG system, nếu agent trả lời sai thì nguyên nhân luôn nằm ở LLM sinh câu trả lời sai.',
    answer: false,
    explanation: 'Sai: phần lớn lỗi do khâu Retrieval bốc nhầm hoặc thiếu tài liệu.',
  },
  {
    id: '18', part: 1, type: 'fill',
    prompt: 'Quá trình chuyển đổi text thành vector số học gọi là ______.',
    answers: ['embedding', 'embeddings'],
  },
  {
    id: '19', part: 1, type: 'fill',
    prompt: 'Tham số kiểm soát mức độ ngẫu nhiên của output là ______.',
    answers: ['temperature'],
  },
  {
    id: '20', part: 1, type: 'fill',
    prompt: 'ReAct step [2]: nơi agent thực tế gọi tool hoặc thực hiện hành động là ______.',
    answers: ['action'],
  },
  {
    id: '21', part: 1, type: 'fill',
    prompt: 'ReAct step [1]: nơi agent suy nghĩ, lập luận là ______.',
    answers: ['thought'],
  },
  {
    id: '22', part: 1, type: 'fill',
    prompt: 'Tham số kiểm soát xác suất tích lũy trong nucleus sampling là ______.',
    answers: ['top_p', 'top p', 'top-p'],
  },
  {
    id: '23', part: 1, type: 'fill',
    prompt: 'ReAct step [3]: kết quả trả về từ tool được đưa vào context gọi là ______.',
    answers: ['observation'],
  },
  {
    id: '24', part: 1, type: 'fill',
    prompt: 'Tham số giới hạn độ dài tối đa của output tính bằng tokens là ______.',
    answers: ['max_tokens', 'max tokens', 'max-tokens'],
  },
  {
    id: '25', part: 1, type: 'fill',
    prompt: 'Phương pháp so sánh góc giữa 2 vector, không phụ thuộc độ dài vector, là ______ similarity.',
    answers: ['cosine'],
    explanation: 'cosine similarity',
  },
  {
    id: '26', part: 1, type: 'fill',
    prompt: 'Lấy ra [3] documents có điểm tương đồng cao nhất — tham số này tên là ______ (hoặc k).',
    answers: ['top_k', 'top k', 'top-k', 'k'],
  },
  {
    id: '27', part: 1, type: 'matching',
    prompt: 'Nối khái niệm (cột A) với mô tả đúng (cột B).',
    left: ['A1. Discriminative AI', 'A2. Generative AI', 'A3. Agentic AI', 'A4. LLM', 'A5. Transformer'],
    right: [
      'Kiến trúc neural network dùng Self-Attention, nền tảng của các model hiện đại',
      'AI tự lập kế hoạch và thực thi nhiều bước hành động để đạt mục tiêu',
      'Foundation model ngôn ngữ lớn, decoder-only, dự đoán token tiếp theo',
      'AI phân loại hoặc dự đoán nhãn từ input (Input → Label)',
      'AI sinh ra nội dung mới từ dữ liệu huấn luyện',
    ],
    pairs: [3, 4, 1, 2, 0],
    explanation: 'A1→B4, A2→B5, A3→B2, A4→B3, A5→B1',
  },
  {
    id: '29', part: 1, type: 'ordering',
    prompt: 'Sắp xếp đúng thứ tự RAG Indexing Pipeline.',
    items: [
      'Load raw documents từ nguồn (PDF, web, DB)',
      'Clean và tiền xử lý text',
      'Chunk document thành các đoạn nhỏ',
      'Embed mỗi chunk thành dense vector',
      'Lưu vectors vào vector database',
    ],
    explanation: 'Load → Clean → Chunk → Embed → Store (B → E → A → C → D)',
  },
  {
    id: '31', part: 1, type: 'ordering',
    prompt: 'Sắp xếp đúng thứ tự AI Product Lifecycle.',
    items: [
      'Problem Scoping (bài toán kinh doanh, ROI)',
      'Data Strategy (nguồn data, chất lượng, pipeline)',
      'Build & Prototype (làm MVP)',
      'Test & Evaluate (chạy eval pipeline)',
      'Deploy (CI/CD, release)',
      'Monitor (theo dõi production)',
      'Iterate (cải thiện theo feedback)',
    ],
    explanation: 'Scope → Data → Build → Eval → Deploy → Monitor → Iterate (C → G → B → D → E → A → F)',
  },
  {
    id: '33', part: 1, type: 'multi',
    prompt: 'Khi nào nên chọn RAG thay vì Fine-tuning? (Chọn nhiều)',
    answers: [
      'Agent cần trả lời từ tài liệu nội bộ công ty được cập nhật hàng tuần',
      'Agent cần truy xuất chính xác từ knowledge base pháp lý hơn 50.000 trang',
      'Agent cần biết giá sản phẩm real-time từ catalog cập nhật liên tục',
    ],
    distractors: [
      'Agent cần học một giọng văn thương hiệu cố định, không thay đổi',
      'Agent chỉ trả lời một tập câu hỏi nhỏ, tĩnh, không bao giờ đổi',
    ],
  },
  {
    id: '34', part: 1, type: 'multi',
    prompt: 'Những guardrails nào hợp lệ cho agent production? (Chọn nhiều)',
    answers: [
      'Input validation: detect và block prompt injection patterns',
      'Output validation: scan response có PII (tên, SĐT, CCCD)',
      'Human-in-the-loop: yêu cầu human approve khi action có tác động cao',
      'Rate limiting: giới hạn requests/phút để tránh abuse',
    ],
    distractors: [
      'Tăng temperature lên 1.8 để agent khó đoán hơn',
      'Tắt toàn bộ logging để tiết kiệm chi phí',
    ],
  },
  {
    id: '36', part: 1, type: 'single',
    prompt: 'ReAct agent gọi tool search_product với tham số rỗng. Nguyên nhân khả dĩ nhất là gì?',
    answer: 'Tool schema thiếu field "parameters" — LLM không biết phải truyền argument nào; tăng temperature không giải quyết được',
    distractors: [
      'Temperature quá thấp, cần tăng lên để agent sáng tạo tham số',
      'Vector database chưa được index đủ dữ liệu',
      'Context window đã hết token',
    ],
    explanation: 'Cũng là đáp án cho câu 93–94.',
  },
  {
    id: '37', part: 1, type: 'single',
    prompt: 'Agent đạt BLEU 0.74 nhưng NPS chỉ 3.1/10. Vì sao?',
    answer: 'BLEU đo lexical overlap với reference answers, không đo khả năng giải quyết vấn đề thực tế; metric không align với North Star Metric (task resolution)',
    distractors: [
      'BLEU quá cao chứng tỏ model overfit, NPS thấp là do lỗi đo NPS',
      'BLEU chỉ đo tốc độ phản hồi nên không liên quan đến NPS',
      'NPS không bao giờ liên quan đến chất lượng sản phẩm AI',
    ],
  },
  {
    id: '39', part: 1, type: 'multi',
    prompt: 'Fintech: agent trả lời SLA ticket P1 là 8 giờ (file 2024) trong khi quy định mới 2026 là 4 giờ; cả 2 file đều có trong vector store, không có effective_date. Chọn 2 thay đổi ở giai đoạn Indexing.',
    answers: [
      'Thêm effective_date và version vào metadata của mỗi chunk để filter khi retrieval',
      'Xóa/deprecate hoàn toàn các chunk thuộc phiên bản tài liệu cũ đã hết hạn',
    ],
    distractors: [
      'Tăng temperature để model tự chọn con số hợp lý',
      'Tăng chunk_size lên 5000 tokens để chứa cả hai phiên bản',
    ],
  },
  {
    id: '41', part: 1, type: 'single',
    prompt: 'Fintech SLA (tiếp): thêm 1 kiểm tra ở Generation stage — kiểm tra nào đúng?',
    answer: 'System prompt bắt buộc model trích dẫn effective_date; nếu tài liệu quá hạn hoặc mâu thuẫn thời gian thì từ chối trả lời và cảnh báo kiểm tra lại tài liệu gốc',
    distractors: [
      'Cho model chọn ngẫu nhiên một trong hai con số rồi trả lời tự tin',
      'Luôn trả lời con số lớn hơn để an toàn',
      'Ẩn nguồn trích dẫn để câu trả lời gọn hơn',
    ],
  },
  {
    id: '42', part: 1, type: 'single',
    prompt: 'Fintech SLA (tiếp): lỗi này xuất phát từ giai đoạn nào?',
    answer: 'Indexing — tài liệu mới và cũ bị nạp lẫn lộn vào vector store mà không có nhãn kiểm soát thời gian hiệu lực',
    distractors: [
      'Generation — model bị lỗi tính toán số',
      'Deployment — server chạy sai phiên bản code',
      'Evaluation — thiếu BLEU score',
    ],
  },
]
