// Thuật ngữ tiếng Anh → giải thích, và thuật ngữ tiếng Việt → tiếng Anh — sinh từ nguồn sổ ôn Phase 1 (scratchpad p1-review); sửa ở nguồn rồi chạy lại to-app.js.
import type { GlossEntry, VIEntry } from '../types'

export const P1_GLOSSARY: GlossEntry[] = [
  [
    "LLM",
    "mô hình ngôn ngữ lớn"
  ],
  [
    "API",
    "giao diện để chương trình gọi dịch vụ"
  ],
  [
    "SDK",
    "bộ thư viện để lập trình với một dịch vụ"
  ],
  [
    "token",
    "mẩu chữ nhỏ nhất model xử lý",
    "i"
  ],
  [
    "prompt",
    "câu lệnh, câu hỏi gửi cho model",
    "i"
  ],
  [
    "system prompt",
    "luật nền do ứng dụng đặt cho model",
    "i"
  ],
  [
    "context window",
    "số token tối đa của một lần gọi",
    "i"
  ],
  [
    "context packet",
    "gói ngữ cảnh ứng dụng lắp trước mỗi lần gọi",
    "i"
  ],
  [
    "context",
    "ngữ cảnh đưa vào model",
    "i"
  ],
  [
    "hallucination",
    "trả lời tự tin nhưng sai",
    "i"
  ],
  [
    "knowledge cutoff",
    "mốc dữ liệu huấn luyện dừng lại",
    "i"
  ],
  [
    "temperature",
    "núm chỉnh độ ngẫu nhiên khi chọn token",
    "i"
  ],
  [
    "top_p",
    "chỉ chọn trong nhóm token có tổng xác suất đạt p"
  ],
  [
    "Transformer",
    "kiến trúc mạng dựa trên attention"
  ],
  [
    "attention",
    "cơ chế cho mỗi token nhìn các token khác",
    "i"
  ],
  [
    "softmax",
    "hàm biến điểm thành xác suất có tổng bằng 1",
    "i"
  ],
  [
    "pre-training",
    "huấn luyện trước trên dữ liệu khổng lồ",
    "i"
  ],
  [
    "SFT",
    "tinh chỉnh bằng ví dụ hỏi–đáp mẫu"
  ],
  [
    "RLHF",
    "căn chỉnh model theo phản hồi của con người"
  ],
  [
    "DPO",
    "căn chỉnh theo cặp câu trả lời được ưa thích"
  ],
  [
    "foundation model",
    "mô hình nền học trên dữ liệu khổng lồ",
    "i"
  ],
  [
    "deep learning",
    "học sâu: mạng nhiều lớp",
    "i"
  ],
  [
    "ML",
    "học máy"
  ],
  [
    "GenAI",
    "AI tạo sinh"
  ],
  [
    "streaming",
    "trả kết quả dần từng phần",
    "i"
  ],
  [
    "stream",
    "gửi dần từng phần",
    "i"
  ],
  [
    "latency",
    "độ trễ",
    "i"
  ],
  [
    "TTFT",
    "thời gian tới token đầu tiên"
  ],
  [
    "STT",
    "chuyển giọng nói thành chữ"
  ],
  [
    "TTS",
    "chuyển chữ thành giọng nói"
  ],
  [
    "voicebot",
    "bot trò chuyện bằng giọng nói",
    "i"
  ],
  [
    "chatbot",
    "bot trò chuyện bằng chữ",
    "i"
  ],
  [
    "IVR",
    "tổng đài bấm phím"
  ],
  [
    "WER",
    "tỷ lệ lỗi từ của nhận dạng giọng nói"
  ],
  [
    "endpointing",
    "phát hiện người nói đã dứt câu",
    "i"
  ],
  [
    "barge-in",
    "người dùng ngắt lời bot",
    "i"
  ],
  [
    "JSON",
    "định dạng dữ liệu dạng cặp khoá–giá trị"
  ],
  [
    "XML",
    "định dạng đánh dấu bằng thẻ"
  ],
  [
    "SQL",
    "ngôn ngữ truy vấn cơ sở dữ liệu"
  ],
  [
    "regex",
    "mẫu dò chuỗi ký tự",
    "i"
  ],
  [
    "schema",
    "khuôn mô tả cấu trúc dữ liệu",
    "i"
  ],
  [
    "enum",
    "danh sách giá trị được phép",
    "i"
  ],
  [
    "GPU",
    "card đồ hoạ, tính song song nhanh"
  ],
  [
    "VRAM",
    "bộ nhớ của GPU"
  ],
  [
    "KV cache",
    "bộ nhớ đệm của các token đã xử lý",
    "i"
  ],
  [
    "agent",
    "LLM tự lập kế hoạch và dùng công cụ",
    "i"
  ],
  [
    "agentic",
    "kiểu AI tự lập kế hoạch và hành động",
    "i"
  ],
  [
    "harness",
    "bộ khung chạy bao quanh model",
    "i"
  ],
  [
    "MCP",
    "chuẩn cắm tool và dữ liệu cho agent"
  ],
  [
    "A2A",
    "giao thức để agent giao việc cho agent"
  ],
  [
    "skills",
    "gói hướng dẫn nghiệp vụ cho agent",
    "i"
  ],
  [
    "tool calling",
    "model yêu cầu gọi hàm kèm tham số",
    "i"
  ],
  [
    "function calling",
    "model trả tên hàm và tham số dạng JSON",
    "i"
  ],
  [
    "tool_calls",
    "danh sách lệnh gọi hàm model trả về"
  ],
  [
    "tool",
    "công cụ agent gọi được, như API hay hàm",
    "i"
  ],
  [
    "ReAct",
    "mẫu xen kẽ suy nghĩ và hành động"
  ],
  [
    "MAX_ITERATIONS",
    "số vòng lặp tối đa"
  ],
  [
    "IATA",
    "mã sân bay 3 chữ cái"
  ],
  [
    "trace",
    "bản ghi từng bước hệ thống đã làm",
    "i"
  ],
  [
    "log",
    "bản ghi hoạt động của hệ thống",
    "i",
    "(?!\\s*[0-9])"
  ],
  [
    "Rule",
    "luật if/else viết sẵn"
  ],
  [
    "workflow",
    "quy trình các bước cố định",
    "i"
  ],
  [
    "pipeline",
    "chuỗi bước xử lý nối tiếp",
    "i"
  ],
  [
    "model routing",
    "chia việc dễ cho model rẻ, việc khó cho model mạnh",
    "i"
  ],
  [
    "routing",
    "phân loại rồi chuyển tới nhánh phù hợp",
    "i"
  ],
  [
    "orchestrator",
    "thành phần điều phối",
    "i"
  ],
  [
    "supervisor",
    "agent điều phối, chia việc",
    "i"
  ],
  [
    "subagent",
    "agent con có context riêng",
    "i"
  ],
  [
    "worker",
    "agent làm một việc hẹp",
    "i"
  ],
  [
    "handoff",
    "trao quyền nói tiếp cho agent khác",
    "i"
  ],
  [
    "LangGraph",
    "thư viện dựng agent thành đồ thị trạng thái"
  ],
  [
    "checkpointer",
    "thành phần lưu trạng thái để dừng rồi chạy tiếp",
    "i"
  ],
  [
    "reducer",
    "hàm quy định cách gộp dữ liệu vào state",
    "i"
  ],
  [
    "state",
    "trạng thái dùng chung giữa các bước",
    "i"
  ],
  [
    "node",
    "một bước xử lý trong đồ thị",
    "i"
  ],
  [
    "thread_id",
    "mã định danh một cuộc hội thoại"
  ],
  [
    "memory",
    "bộ nhớ của agent",
    "i"
  ],
  [
    "sandbox",
    "môi trường cô lập để chạy an toàn",
    "i"
  ],
  [
    "JSON-RPC",
    "giao thức gọi hàm từ xa bằng JSON"
  ],
  [
    "stdio",
    "giao tiếp qua đầu vào/ra chuẩn của tiến trình"
  ],
  [
    "Streamable HTTP",
    "cách truyền của MCP qua HTTP có stream"
  ],
  [
    "Agent Card",
    "thẻ JSON mô tả năng lực của một agent"
  ],
  [
    "tool poisoning",
    "mô tả tool chứa chỉ thị độc",
    "i"
  ],
  [
    "few-shot",
    "đưa vài ví dụ mẫu trong prompt",
    "i"
  ],
  [
    "zero-shot",
    "không đưa ví dụ nào",
    "i"
  ],
  [
    "one-shot",
    "đưa một ví dụ mẫu",
    "i"
  ],
  [
    "CoT",
    "suy luận từng bước"
  ],
  [
    "ToT",
    "thử nhiều hướng suy luận rồi chọn"
  ],
  [
    "delimiter",
    "ký hiệu phân tách các phần",
    "i"
  ],
  [
    "context bleed",
    "model nhầm dữ liệu thành lệnh",
    "i"
  ],
  [
    "prompt injection",
    "chèn lệnh để bẻ lái model",
    "i"
  ],
  [
    "jailbreak",
    "mẹo vượt bộ lọc an toàn",
    "i"
  ],
  [
    "lost in the middle",
    "thông tin ở giữa context dễ bị bỏ sót",
    "i"
  ],
  [
    "context rot",
    "chất lượng tụt khi context dài và nhiễu",
    "i"
  ],
  [
    "compaction",
    "nén lịch sử hội thoại",
    "i"
  ],
  [
    "output contract",
    "cam kết định dạng đầu ra",
    "i"
  ],
  [
    "prompt caching",
    "tái dùng phần đầu prompt đã xử lý để rẻ hơn",
    "i"
  ],
  [
    "prompt cache",
    "tái dùng phần đầu prompt đã xử lý để rẻ hơn",
    "i"
  ],
  [
    "semantic cache",
    "trả lời lại cho câu hỏi gần nghĩa",
    "i"
  ],
  [
    "semantic caching",
    "trả lời lại cho câu hỏi gần nghĩa",
    "i"
  ],
  [
    "cache",
    "bộ nhớ đệm",
    "i"
  ],
  [
    "happy path",
    "kịch bản suôn sẻ, không có lỗi",
    "i"
  ],
  [
    "edge case",
    "tình huống biên, hiếm gặp",
    "i"
  ],
  [
    "MVP",
    "sản phẩm khả dụng tối thiểu"
  ],
  [
    "PRD",
    "tài liệu yêu cầu sản phẩm"
  ],
  [
    "prototype",
    "bản dựng thử",
    "i"
  ],
  [
    "wireframe",
    "bản phác khung giao diện",
    "i"
  ],
  [
    "mockup",
    "bản thiết kế hình ảnh tĩnh",
    "i"
  ],
  [
    "PM",
    "quản lý sản phẩm"
  ],
  [
    "TA",
    "trợ giảng"
  ],
  [
    "CSKH",
    "chăm sóc khách hàng"
  ],
  [
    "CSAT",
    "điểm hài lòng của khách"
  ],
  [
    "UX",
    "trải nghiệm người dùng"
  ],
  [
    "UI",
    "giao diện người dùng"
  ],
  [
    "PAIR",
    "bộ hướng dẫn People + AI của Google"
  ],
  [
    "HAX",
    "bộ công cụ thiết kế tương tác người–AI của Microsoft"
  ],
  [
    "ROI",
    "lợi ích thu về so với chi phí bỏ ra"
  ],
  [
    "stakeholder",
    "người có liên quan, có quyền quyết",
    "i"
  ],
  [
    "precision",
    "trong những gì báo CÓ, đúng bao nhiêu",
    "i"
  ],
  [
    "recall@k",
    "đáp án đúng có nằm trong top-k không",
    "i"
  ],
  [
    "recall",
    "trong những gì CÓ thật, bắt được bao nhiêu",
    "i"
  ],
  [
    "false positive",
    "báo nhầm",
    "i"
  ],
  [
    "false negative",
    "bỏ sót",
    "i"
  ],
  [
    "eval",
    "đánh giá chất lượng trên bộ case",
    "i"
  ],
  [
    "evals",
    "các bài đánh giá chất lượng",
    "i"
  ],
  [
    "benchmark",
    "bộ đề chuẩn để so sánh",
    "i"
  ],
  [
    "baseline",
    "phiên bản gốc để so sánh",
    "i"
  ],
  [
    "regression",
    "thứ từng chạy tốt nay tệ đi",
    "i"
  ],
  [
    "golden dataset",
    "bộ câu hỏi chuẩn có đáp án",
    "i"
  ],
  [
    "rubric",
    "barem chấm điểm",
    "i"
  ],
  [
    "vibe check",
    "thử tay vài ca, chấm cảm tính",
    "i"
  ],
  [
    "LLM-as-a-judge",
    "dùng một LLM để chấm câu trả lời",
    "i"
  ],
  [
    "LLM-as-judge",
    "dùng một LLM để chấm câu trả lời",
    "i"
  ],
  [
    "LLM-judge",
    "dùng một LLM để chấm câu trả lời",
    "i"
  ],
  [
    "judge",
    "model chấm điểm output",
    "i"
  ],
  [
    "calibration",
    "đối chiếu máy chấm với người chấm",
    "i"
  ],
  [
    "TPR",
    "tỷ lệ nhận đúng output tốt"
  ],
  [
    "TNR",
    "tỷ lệ bắt được output lỗi"
  ],
  [
    "pass@k",
    "đúng ít nhất 1 trong k lần",
    "i"
  ],
  [
    "pass^k",
    "đúng cả k lần liên tiếp",
    "i"
  ],
  [
    "ground truth",
    "đáp án đúng do người xác nhận",
    "i"
  ],
  [
    "RAGAS",
    "bộ chỉ số đánh giá RAG"
  ],
  [
    "faithfulness",
    "câu trả lời bám tài liệu, không bịa",
    "i"
  ],
  [
    "context recall",
    "đã tìm đủ bằng chứng cần thiết chưa",
    "i"
  ],
  [
    "answer relevance",
    "có trả lời đúng điều được hỏi không",
    "i"
  ],
  [
    "RAG",
    "tìm tài liệu rồi trả lời dựa trên đó"
  ],
  [
    "retrieval",
    "bước tìm tài liệu liên quan",
    "i"
  ],
  [
    "retriever",
    "thành phần tìm tài liệu",
    "i"
  ],
  [
    "chunking",
    "chia tài liệu thành đoạn",
    "i"
  ],
  [
    "chunk",
    "đoạn tài liệu nhỏ",
    "i"
  ],
  [
    "overlap",
    "phần gối nhau giữa hai đoạn",
    "i"
  ],
  [
    "embedding",
    "vector số biểu diễn ý nghĩa",
    "i"
  ],
  [
    "vector store",
    "kho lưu và tìm vector",
    "i"
  ],
  [
    "vector database",
    "kho lưu và tìm vector",
    "i"
  ],
  [
    "vector DB",
    "kho lưu và tìm vector",
    "i"
  ],
  [
    "vector",
    "dãy số",
    "i"
  ],
  [
    "cosine",
    "đo góc giữa hai vector",
    "i"
  ],
  [
    "BM25",
    "thuật toán tìm theo từ khoá"
  ],
  [
    "TF-IDF",
    "chấm từ khoá theo độ hiếm"
  ],
  [
    "dense",
    "tìm theo nghĩa bằng embedding",
    "i"
  ],
  [
    "sparse",
    "tìm theo từ khoá",
    "i"
  ],
  [
    "hybrid search",
    "kết hợp tìm theo nghĩa và theo từ khoá",
    "i"
  ],
  [
    "RRF",
    "gộp các bảng xếp hạng theo thứ hạng"
  ],
  [
    "rerank",
    "xếp hạng lại",
    "i"
  ],
  [
    "reranker",
    "model xếp hạng lại",
    "i"
  ],
  [
    "cross-encoder",
    "model đọc câu hỏi và tài liệu cùng lúc",
    "i"
  ],
  [
    "bi-encoder",
    "model mã hoá câu hỏi và tài liệu riêng",
    "i"
  ],
  [
    "MMR",
    "chọn kết quả vừa liên quan vừa khác nhau"
  ],
  [
    "HyDE",
    "tìm bằng câu trả lời giả định"
  ],
  [
    "top-k",
    "k kết quả đứng đầu",
    "i"
  ],
  [
    "ANN",
    "tìm láng giềng gần đúng, rất nhanh"
  ],
  [
    "HNSW",
    "đồ thị nhiều tầng để tìm vector nhanh"
  ],
  [
    "IVF",
    "chia kho vector thành cụm rồi tìm trong vài cụm"
  ],
  [
    "nprobe",
    "số cụm được quét khi tìm",
    "i"
  ],
  [
    "FAISS",
    "thư viện tìm vector của Meta"
  ],
  [
    "Chroma",
    "vector database nhúng, dễ dùng"
  ],
  [
    "pgvector",
    "phần mở rộng vector cho Postgres"
  ],
  [
    "metadata",
    "thông tin kèm theo như nguồn, ngày, quyền",
    "i"
  ],
  [
    "OCR",
    "nhận dạng chữ trong ảnh"
  ],
  [
    "Unicode",
    "bảng mã ký tự chuẩn"
  ],
  [
    "NFC",
    "dạng Unicode ghép sẵn dấu"
  ],
  [
    "NFD",
    "dạng Unicode tách dấu riêng"
  ],
  [
    "PII",
    "thông tin định danh cá nhân"
  ],
  [
    "fine-tuning",
    "tinh chỉnh model trên dữ liệu riêng",
    "i"
  ],
  [
    "fine-tune",
    "tinh chỉnh model trên dữ liệu riêng",
    "i"
  ],
  [
    "grounding",
    "neo câu trả lời vào tài liệu",
    "i"
  ],
  [
    "grounded",
    "dựa trên dữ liệu thật",
    "i"
  ],
  [
    "citation",
    "trích dẫn nguồn",
    "i"
  ],
  [
    "ETL",
    "trích → biến đổi → nạp"
  ],
  [
    "ELT",
    "trích → nạp → biến đổi trong kho"
  ],
  [
    "CDC",
    "chỉ bắt các thay đổi của dữ liệu"
  ],
  [
    "batch",
    "xử lý theo lô định kỳ",
    "i"
  ],
  [
    "watermark",
    "mốc đánh dấu đã nạp tới đâu",
    "i"
  ],
  [
    "backpressure",
    "tín hiệu bảo nguồn gửi chậm lại",
    "i"
  ],
  [
    "rate limit",
    "giới hạn số request trong một khoảng thời gian",
    "i"
  ],
  [
    "idempotent",
    "chạy lại không sinh kết quả trùng",
    "i"
  ],
  [
    "idempotency",
    "tính chạy lại không sinh kết quả trùng",
    "i"
  ],
  [
    "UPSERT",
    "thêm mới, hoặc ghi đè nếu đã có"
  ],
  [
    "DLQ",
    "hàng đợi chứa bản ghi lỗi để xử lý sau"
  ],
  [
    "dead-letter queue",
    "hàng đợi chứa bản ghi lỗi để xử lý sau",
    "i"
  ],
  [
    "lineage",
    "bản đồ dữ liệu đi từ đâu tới đâu",
    "i"
  ],
  [
    "freshness",
    "độ tươi của dữ liệu",
    "i"
  ],
  [
    "schema drift",
    "cấu trúc bảng đổi ngoài kế hoạch",
    "i"
  ],
  [
    "drift",
    "trôi dần khỏi trạng thái ban đầu",
    "i"
  ],
  [
    "data contract",
    "thoả thuận dữ liệu giữa bên sinh và bên dùng",
    "i"
  ],
  [
    "medallion",
    "chia kho thành tầng thô, sạch, sẵn dùng",
    "i"
  ],
  [
    "dbt",
    "công cụ viết bước biến đổi dữ liệu bằng SQL"
  ],
  [
    "Airflow",
    "công cụ lập lịch và điều phối pipeline"
  ],
  [
    "cron",
    "lịch chạy cố định theo giờ",
    "i"
  ],
  [
    "backfill",
    "chạy lại cho khoảng thời gian cũ",
    "i"
  ],
  [
    "z-score",
    "độ lệch tính bằng số lần độ lệch chuẩn",
    "i"
  ],
  [
    "MAD",
    "độ lệch tuyệt đối trung vị"
  ],
  [
    "PSI",
    "chỉ số đo phân phối lệch bao xa"
  ],
  [
    "STL",
    "tách chuỗi thành xu hướng, mùa vụ, phần dư"
  ],
  [
    "alert fatigue",
    "quá nhiều cảnh báo nên người ta bỏ qua",
    "i"
  ],
  [
    "runbook",
    "sổ tay xử lý sự cố từng bước",
    "i"
  ],
  [
    "post-mortem",
    "phân tích sau sự cố",
    "i"
  ],
  [
    "observability",
    "khả năng nhìn vào hệ thống để biết vì sao nó hỏng",
    "i"
  ],
  [
    "monitoring",
    "theo dõi các chỉ số đã biết trước",
    "i"
  ],
  [
    "HITL",
    "con người tham gia duyệt hoặc quyết"
  ],
  [
    "human-in-the-loop",
    "con người tham gia duyệt hoặc quyết",
    "i"
  ],
  [
    "guardrails",
    "các lớp chặn và kiểm tra quanh model",
    "i"
  ],
  [
    "guardrail",
    "lớp chặn và kiểm tra quanh model",
    "i"
  ],
  [
    "red teaming",
    "tự tấn công hệ thống để tìm lỗ hổng",
    "i"
  ],
  [
    "red team",
    "tự tấn công hệ thống để tìm lỗ hổng",
    "i"
  ],
  [
    "OWASP",
    "tổ chức công bố danh sách lỗ hổng phổ biến"
  ],
  [
    "Base64",
    "cách mã hoá dữ liệu thành chữ"
  ],
  [
    "spotlighting",
    "đánh dấu rõ đâu là dữ liệu",
    "i"
  ],
  [
    "CaMeL",
    "kiến trúc hai model tách lệnh khỏi dữ liệu"
  ],
  [
    "lethal trifecta",
    "dữ liệu riêng tư + nội dung lạ + kênh ra ngoài",
    "i"
  ],
  [
    "automation bias",
    "thiên kiến tin máy, bỏ qua tự kiểm",
    "i"
  ],
  [
    "audit trail",
    "bản ghi ai quyết gì, lúc nào",
    "i"
  ],
  [
    "model card",
    "tài liệu mô tả mục đích và giới hạn của model",
    "i"
  ],
  [
    "DPIA",
    "đánh giá tác động của việc xử lý dữ liệu"
  ],
  [
    "EU AI Act",
    "luật AI của Liên minh châu Âu",
    "i"
  ],
  [
    "GDPR",
    "luật bảo vệ dữ liệu của EU"
  ],
  [
    "Docker",
    "công cụ đóng gói ứng dụng thành container"
  ],
  [
    "Dockerfile",
    "công thức build container"
  ],
  [
    "container",
    "gói ứng dụng chạy được ở mọi nơi",
    "i"
  ],
  [
    "CVE",
    "mã định danh lỗ hổng bảo mật công khai"
  ],
  [
    "SSE",
    "luồng sự kiện server gửi về trình duyệt"
  ],
  [
    "WebSocket",
    "kênh hai chiều giữa trình duyệt và server"
  ],
  [
    "timeout",
    "thời hạn chờ tối đa",
    "i"
  ],
  [
    "heartbeat",
    "tín hiệu \"còn sống\" gửi định kỳ",
    "i"
  ],
  [
    "proxy",
    "máy trung gian chuyển tiếp request",
    "i"
  ],
  [
    "gateway",
    "cổng đứng trước dịch vụ",
    "i"
  ],
  [
    "load balancer",
    "bộ chia tải giữa các máy",
    "i"
  ],
  [
    "health check",
    "endpoint báo dịch vụ còn sống",
    "i"
  ],
  [
    "async",
    "chạy nền, không bắt người dùng chờ",
    "i"
  ],
  [
    "webhook",
    "URL được gọi khi có sự kiện",
    "i"
  ],
  [
    "Redis",
    "kho dữ liệu trong RAM, rất nhanh"
  ],
  [
    "Postgres",
    "hệ cơ sở dữ liệu quan hệ phổ biến"
  ],
  [
    "Kubernetes",
    "nền tảng điều phối container"
  ],
  [
    "serverless",
    "chạy hàm mà không quản server",
    "i"
  ],
  [
    "cold start",
    "độ trễ khi khởi động bản chạy mới",
    "i"
  ],
  [
    "instance",
    "một bản chạy của dịch vụ",
    "i"
  ],
  [
    "concurrency",
    "số request xử lý cùng lúc",
    "i"
  ],
  [
    "CI/CD",
    "tự động build, test và deploy"
  ],
  [
    "canary",
    "thả bản mới cho một phần nhỏ người dùng trước",
    "i"
  ],
  [
    "rollback",
    "quay về bản cũ",
    "i"
  ],
  [
    "deploy",
    "đưa lên chạy thật",
    "i"
  ],
  [
    "production",
    "môi trường chạy thật cho người dùng",
    "i"
  ],
  [
    "OAuth",
    "chuẩn uỷ quyền truy cập"
  ],
  [
    "CORS",
    "luật trình duyệt về gọi khác tên miền"
  ],
  [
    "vLLM",
    "engine phục vụ LLM tự host hiệu năng cao"
  ],
  [
    "Ollama",
    "công cụ chạy LLM trên máy cá nhân"
  ],
  [
    "nginx",
    "web server, proxy ngược"
  ],
  [
    "SIGTERM",
    "tín hiệu yêu cầu tiến trình dừng"
  ],
  [
    "Trivy",
    "công cụ quét lỗ hổng container"
  ],
  [
    "fallback",
    "phương án dự phòng",
    "i"
  ],
  [
    "circuit breaker",
    "cầu dao ngắt khi dịch vụ phía sau hỏng",
    "i"
  ],
  [
    "on-premise",
    "chạy trên máy chủ của chính tổ chức",
    "i"
  ],
  [
    "on-prem",
    "chạy trên máy chủ của chính tổ chức",
    "i"
  ],
  [
    "FinOps",
    "quản trị chi phí hạ tầng"
  ],
  [
    "P50",
    "thời gian mà 50% request nhanh hơn"
  ],
  [
    "P95",
    "thời gian mà 95% request nhanh hơn"
  ],
  [
    "P99",
    "thời gian mà 99% request nhanh hơn"
  ],
  [
    "OpenTelemetry",
    "chuẩn mở cho log, metric, trace"
  ],
  [
    "OTel",
    "chuẩn mở cho log, metric, trace"
  ],
  [
    "span",
    "một bước bên trong trace",
    "i"
  ],
  [
    "metrics",
    "chỉ số đo theo thời gian",
    "i"
  ],
  [
    "metric",
    "chỉ số đo theo thời gian",
    "i"
  ],
  [
    "dashboard",
    "bảng hiển thị chỉ số",
    "i"
  ],
  [
    "alert",
    "cảnh báo tự động",
    "i"
  ],
  [
    "Prometheus",
    "hệ thu thập metric"
  ],
  [
    "Grafana",
    "công cụ vẽ dashboard"
  ],
  [
    "Langfuse",
    "công cụ trace và đo chi phí cho LLM"
  ],
  [
    "LangSmith",
    "công cụ trace và eval của LangChain"
  ],
  [
    "cardinality",
    "số tổ hợp giá trị nhãn",
    "i"
  ],
  [
    "correlation ID",
    "mã nối mọi log của một request",
    "i"
  ],
  [
    "sampling",
    "chỉ giữ một phần mẫu",
    "i"
  ],
  [
    "SLA",
    "cam kết dịch vụ có hậu quả khi trượt"
  ],
  [
    "SLO",
    "mục tiêu dịch vụ đo được"
  ],
  [
    "SLI",
    "con số đo chất lượng dịch vụ"
  ],
  [
    "error budget",
    "thời gian được phép hỏng",
    "i"
  ]
]

export const P1_VI: VIEntry[] = [
  [
    "cửa sổ ngữ cảnh",
    "context window"
  ],
  [
    "độ trễ",
    "latency"
  ],
  [
    "ngưỡng",
    "threshold"
  ],
  [
    "nhiệt độ",
    "temperature"
  ],
  [
    "trung vị",
    "median"
  ],
  [
    "độ lệch chuẩn",
    "standard deviation"
  ],
  [
    "ảo giác",
    "hallucination"
  ],
  [
    "truy xuất",
    "retrieval"
  ],
  [
    "xếp hạng lại",
    "rerank"
  ],
  [
    "trích dẫn",
    "citation"
  ],
  [
    "bộ nhớ đệm",
    "cache"
  ],
  [
    "lượng tử hoá",
    "quantization"
  ],
  [
    "mùa vụ",
    "seasonality"
  ],
  [
    "hàng đợi",
    "queue"
  ],
  [
    "chi phí ẩn",
    "hidden cost"
  ],
  [
    "khả năng hoàn tác",
    "reversibility"
  ],
  [
    "dữ liệu huấn luyện",
    "training data"
  ],
  [
    "tỷ lệ trúng cache",
    "cache hit rate"
  ],
  [
    "đuôi dài",
    "long tail"
  ],
  [
    "lỗi cộng dồn",
    "compounding error"
  ]
]
