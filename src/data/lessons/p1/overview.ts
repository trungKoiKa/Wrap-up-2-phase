// Trang Tổng quan Phase 1 — sinh từ nguồn sổ ôn Phase 1 (scratchpad p1-review); sửa ở nguồn rồi chạy lại to-app.js.
import type { Overview } from '../types'

export const P1_OVERVIEW: Overview = {
  "intro": "Phase 1 đi từ một lời gọi API tới một agent chạy thật cho người dùng: hiểu LLM, chọn đúng bài toán, xây agent có công cụ và dữ liệu, rồi đưa lên production có an toàn, giám sát và đánh giá. Nếu mới bắt đầu, hãy đọc theo thứ tự dưới đây: mỗi buổi dùng lại khái niệm của buổi trước. Bộ tài liệu không có Day 6.",
  "flow": [
    {
      "day": "day1",
      "label": "Hiểu LLM",
      "text": "Token, attention, giới hạn bẩm sinh và cách tính tiền mỗi lần gọi."
    },
    {
      "day": "day2",
      "label": "Chọn bài toán",
      "text": "Problem Card, đo được, và chọn Rule, Workflow hay Agent."
    },
    {
      "day": "day3",
      "label": "Agent đầu tiên",
      "text": "Vòng ReAct: nghĩ, gọi tool, quan sát, lặp lại."
    },
    {
      "day": "day4",
      "label": "Nói cho đúng",
      "text": "Prompt, context packet, tool schema và LangGraph."
    },
    {
      "day": "day5",
      "label": "Thành sản phẩm",
      "text": "Prototype, PRD cho AI, niềm tin, precision và recall."
    },
    {
      "day": "day7",
      "label": "Dữ liệu",
      "text": "Embedding, chunking, vector store, hybrid search."
    },
    {
      "day": "day8",
      "label": "Truy xuất",
      "text": "RAG đầy đủ: tìm, xếp hạng lại, trích dẫn, đo bằng RAGAS."
    },
    {
      "day": "day9",
      "label": "Phối hợp",
      "text": "Supervisor–worker, MCP, A2A, harness."
    },
    {
      "day": "day10",
      "label": "Nạp dữ liệu",
      "text": "Pipeline, quality gate, data observability."
    },
    {
      "day": "day11",
      "label": "An toàn",
      "text": "Guardrails, HITL, luật và trách nhiệm."
    },
    {
      "day": "day12",
      "label": "Lên cloud",
      "text": "Container, streaming, timeout, chặn chi phí."
    },
    {
      "day": "day13",
      "label": "Giám sát",
      "text": "Metrics, logs, traces, SLO và chi phí."
    },
    {
      "day": "day14",
      "label": "Evaluation",
      "text": "Trace code, dataset, judge, đọc kết quả cho đúng."
    },
    {
      "day": "day15",
      "label": "Vận hành",
      "text": "Chi phí thật, ba đòn bẩy tối ưu, chọn track Phase 2."
    }
  ],
  "howto": [
    "Đọc \"Câu hỏi của buổi\" và \"Hình dung đơn giản\" trước để biết mình đang giải bài toán gì.",
    "Đi theo \"Lộ trình hiểu\" từ trên xuống; mỗi khái niệm có một ví dụ cụ thể lấy từ bài giảng.",
    "Mỗi buổi có một mô phỏng \"Thử tay\": kéo thanh trượt, bấm nút và đọc kết quả bên dưới.",
    "Với công thức, đọc dòng \"Đọc là\" trước, rồi mới nhìn ký hiệu.",
    "Thuật ngữ chuyên ngành luôn để tiếng Anh trước, nghĩa tiếng Việt trong ngoặc ở lần xuất hiện đầu tiên của mỗi trang.",
    "Cuối buổi, tự trả lời thẻ kiểm tra rồi mới mở đáp án; đánh dấu thẻ đã nhớ."
  ],
  "glossary": [
    [
      "Mô hình ngôn ngữ lớn",
      "LLM",
      "Mạng Transformer rất lớn đoán token tiếp theo."
    ],
    [
      "Token",
      "token",
      "Mẩu chữ nhỏ nhất model đọc và viết; đơn vị tính tiền."
    ],
    [
      "Cửa sổ ngữ cảnh",
      "context window",
      "Số token tối đa của một lần gọi, gồm cả vào và ra."
    ],
    [
      "Ảo giác",
      "hallucination",
      "Trả lời trôi chảy, tự tin nhưng sai."
    ],
    [
      "Agent",
      "agent",
      "LLM trong vòng lặp, có tool, tự quyết bước tiếp theo."
    ],
    [
      "Gọi công cụ",
      "tool calling",
      "Model sinh tên hàm + tham số; ứng dụng thực thi."
    ],
    [
      "Embedding",
      "embedding",
      "Vector số biểu diễn ý nghĩa; gần nghĩa thì gần nhau."
    ],
    [
      "RAG",
      "Retrieval-Augmented Generation",
      "Tìm tài liệu liên quan rồi bắt model trả lời dựa trên đó."
    ],
    [
      "Guardrails",
      "guardrails",
      "Các lớp chặn đầu vào xấu và kiểm tra đầu ra."
    ],
    [
      "Người trong vòng lặp",
      "HITL",
      "Con người duyệt hoặc quyết ở những điểm rủi ro."
    ],
    [
      "Dấu vết",
      "trace",
      "Bản ghi từng bước agent đã làm; dùng để debug và đánh giá."
    ],
    [
      "Đánh giá",
      "eval",
      "Chấm chất lượng trên bộ case cố định, lặp lại được."
    ],
    [
      "Độ trễ",
      "latency",
      "Thời gian từ lúc gửi tới lúc có kết quả."
    ],
    [
      "Mục tiêu dịch vụ",
      "SLO",
      "Mục tiêu đo được, ví dụ 99,9% request dưới 5 giây."
    ],
    [
      "Thông tin cá nhân",
      "PII",
      "Tên, SĐT, CCCD, email… phải che trước khi lưu hay log."
    ],
    [
      "Giao thức MCP",
      "Model Context Protocol",
      "Chuẩn cắm tool và dữ liệu cho agent, như cổng USB."
    ]
  ]
}
