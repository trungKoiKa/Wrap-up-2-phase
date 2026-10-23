// Trang Tổng quan: mạch nối 12 buổi và thuật ngữ chung.
import type { Overview } from './types'

export const OVERVIEW: Overview = {
  "intro": "Phase 2 dạy cách một chiếc xe tự lái hay robot \"nhìn\", \"nhớ\", \"hiểu\" và được \"kiểm tra\" trước khi ra đường. Mỗi buổi giải một mắt xích. Nếu mới bắt đầu, hãy đọc theo thứ tự dưới đây: mỗi buổi dùng lại khái niệm của buổi trước.",
  "flow": [
    {
      "day": "day16",
      "label": "Học",
      "text": "Mạng nơ-ron học thế nào: mất mát, gradient, tối ưu."
    },
    {
      "day": "day17",
      "label": "Kiến trúc",
      "text": "Tích chập, RNN, attention: bộ \"mắt\" để rút đặc trưng."
    },
    {
      "day": "day18",
      "label": "Nhìn 2D",
      "text": "Phát hiện, phân đoạn, keypoint trên từng ảnh."
    },
    {
      "day": "day19",
      "label": "Cảm biến",
      "text": "Mỗi cảm biến đo gì, hỏng ra sao; hiệu chuẩn và đồng bộ thời gian."
    },
    {
      "day": "day20",
      "label": "Ước lượng",
      "text": "Kalman: trộn dự đoán với cảm biến nhiễu."
    },
    {
      "day": "day21",
      "label": "Điểm 3D",
      "text": "Point cloud, voxel và pillar, hộp 3D, chiếu LiDAR lên ảnh."
    },
    {
      "day": "day22",
      "label": "Nhớ",
      "text": "Tracking: giữ ID cho từng vật qua thời gian."
    },
    {
      "day": "day23",
      "label": "Nhìn 3D",
      "text": "Độ sâu, BEV và hợp nhất camera, LiDAR, radar."
    },
    {
      "day": "day24",
      "label": "Dữ liệu",
      "text": "Pipeline dữ liệu và gán nhãn có kiểm soát."
    },
    {
      "day": "day25",
      "label": "Hiểu",
      "text": "VLM đọc ảnh bằng ngôn ngữ; VLA ra hành động."
    },
    {
      "day": "day26",
      "label": "Tạo dữ liệu",
      "text": "Mô phỏng, tái dựng, sinh dữ liệu cho cảnh hiếm."
    },
    {
      "day": "day27",
      "label": "Kiểm thử",
      "text": "Phát lại, vòng kín, kịch bản trước khi chạy thật."
    }
  ],
  "howto": [
    "Đọc \"Câu hỏi của buổi\" và \"Hình dung\" trước để biết mình đang giải bài toán gì.",
    "Đi theo \"Lộ trình hiểu\" từ trên xuống; mỗi khái niệm có ví dụ cụ thể.",
    "Với công thức, đọc dòng \"Đọc là\" trước, rồi mới nhìn ký hiệu.",
    "Cuối buổi, tự trả lời thẻ kiểm tra rồi mới mở đáp án; đánh dấu thẻ đã nhớ."
  ],
  "glossary": [
    [
      "Tham số / trọng số",
      "parameter / weight",
      "Các con số mạng tự chỉnh khi học."
    ],
    [
      "Hàm mất mát",
      "loss",
      "Con số đo mô hình sai bao nhiêu."
    ],
    [
      "Gradient",
      "gradient",
      "Hướng làm mất mát tăng nhanh nhất; ta đi ngược lại."
    ],
    [
      "Backbone",
      "backbone",
      "Phần mạng rút đặc trưng từ ảnh, dùng chung cho nhiều tác vụ."
    ],
    [
      "Hộp bao",
      "bounding box",
      "Hình chữ nhật khoanh một vật."
    ],
    [
      "IoU",
      "Intersection over Union",
      "Độ chồng lấn hai hộp, từ 0 đến 1."
    ],
    [
      "Ground truth (GT)",
      "ground truth",
      "Đáp án đúng do người gán nhãn."
    ],
    [
      "mAP",
      "mean Average Precision",
      "Điểm tổng hợp chất lượng phát hiện."
    ],
    [
      "Track / ID",
      "track",
      "Một vật được theo dõi qua nhiều khung, mang một số định danh."
    ],
    [
      "BEV",
      "bird's-eye view",
      "Bản đồ nhìn từ trên xuống quanh xe."
    ],
    [
      "Ego",
      "ego vehicle",
      "Chính chiếc xe đang lái."
    ],
    [
      "Hiệu chuẩn",
      "calibration",
      "Thông số riêng và vị trí lắp của từng cảm biến."
    ],
    [
      "Leakage",
      "data leakage",
      "Dữ liệu test lọt vào train, làm điểm đẹp giả."
    ],
    [
      "Vòng hở / vòng kín",
      "open / closed loop",
      "Chấm so với log / để hệ thống tự chạy và chịu hậu quả."
    ],
    [
      "Độ trễ",
      "latency",
      "Thời gian từ lúc có dữ liệu tới lúc có kết quả."
    ]
  ]
}
