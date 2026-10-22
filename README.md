# AI In Action · Web ôn thi

Ứng dụng web một trang để ôn thi môn **AI In Action** (VinUni). Có hai nhóm đề trắc nghiệm và hai sổ ôn lý thuyết kèm mô phỏng tương tác. Chạy hoàn toàn trên trình duyệt, không cần backend; tiến độ lưu trong `localStorage`.

## Tính năng

**Làm đề**
- Hai nhóm đề, tổng **661 câu**:
  - **Giữa kỳ · AI In Action**: 82 câu, chia 4 phần (Kiến thức nền tảng, Business & Product, Infra & FinOps, App Build & Agents).
  - **Phase 2 · CV & Perception**: 579 câu theo 10 buổi (Day 16–27), lọc được theo mức ưu tiên *Cốt lõi / Quan trọng / Chi tiết*.
- 7 dạng câu: một đáp án, nhiều đáp án, đúng/sai, điền khuyết, nối cột, sắp xếp (kéo thả) và tự luận (có đáp án mẫu).
- Hai chế độ:
  - **Thi thử**: đồng hồ đếm ngược theo số giây mỗi câu.
  - **Luyện tập**: đồng hồ đếm lên, xem đáp án và giải thích ngay sau mỗi câu.
- Cách chọn câu:
  - đề ngẫu nhiên (ưu tiên câu chưa làm hoặc từng sai);
  - chỉ các câu chưa gặp;
  - toàn bộ phạm vi.
- **Sổ câu sai**: một câu rời sổ sau khi làm đúng N lần liên tiếp (chỉnh được).
- Trang **Tra cứu** toàn bộ đáp án và trang **Tiến độ** xem lịch sử điểm theo từng phần.

**Ôn tập** (`#/learn`)
- **Sổ Phase 1 · Nền tảng AI**: Day 1–15, 14 buổi (không có Day 6).
- **Sổ Phase 2 · CV & Perception**: Day 16–27, 10 buổi.
- Mỗi buổi gồm:
  - câu hỏi của buổi, hình dung, lộ trình;
  - khái niệm kèm ví dụ;
  - mô phỏng tương tác ("Thử tay");
  - công thức (KaTeX) kèm cách đọc;
  - bảng so sánh, bẫy hay gặp, 3 điều cần nhớ;
  - thẻ tự kiểm tra (đánh dấu "Đã nhớ").
- Thuật ngữ chuyên ngành được tự chú giải ở lần xuất hiện đầu tiên trên trang.
  - Sổ Phase 1 ghi tiếng Anh trước, nghĩa tiếng Việt trong ngoặc, ví dụ "temperature (nhiệt độ)".
- Cuối mỗi buổi Phase 2 có nút làm đề đúng buổi đó. Trong lúc làm bài có link quay lại lý thuyết.

**Giao diện**
- Chế độ sáng / tối / theo hệ thống.
- Hai bảng màu: Ocean (xanh biển, mặc định) và Ghibli (xanh lá).
- Dùng tốt trên điện thoại (từ 375 px), điều khiển được bằng bàn phím.
- Trong ô tự luận, Tab chèn thụt lề; nhấn Esc rồi Tab để rời ô.
- **Cài đặt**: xuất/nhập toàn bộ dữ liệu ra file JSON, hoặc xoá tiến độ.

## Công nghệ

| Thành phần | Dùng |
| --- | --- |
| Khung | React 19, TypeScript, Vite |
| Giao diện | Tailwind CSS v4, lucide-react |
| Điều hướng | react-router-dom (`HashRouter`, nên chạy được cả khi mở file tĩnh) |
| Kéo thả | @dnd-kit |
| Công thức | KaTeX (đóng gói sẵn, không cần mạng) |
| Kiểm thử, lint | Vitest, Oxlint |

## Cài đặt và chạy

Yêu cầu Node.js 20.19+ hoặc 22.12+ (theo Vite 8).

> Mã nguồn nằm trong thư mục `ai-in-action-quiz`. Chạy lệnh ở thư mục cha `OnThiMidTerm` sẽ báo lỗi `ENOENT ... package.json`.

```bash
cd ai-in-action-quiz
npm install
npm run dev
```

Mở http://localhost:5173.

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Chạy máy chủ phát triển (tự tải lại khi sửa code) |
| `npm test` | Chạy toàn bộ test (Vitest) |
| `npm run lint` | Kiểm tra code bằng Oxlint |
| `npm run build` | Kiểm tra kiểu (`tsc -b`) rồi đóng gói vào `dist/` |
| `npm run preview` | Xem thử bản đã đóng gói |

`vite.config.ts` đặt `base: './'`, nên có thể đưa thư mục `dist/` lên bất kỳ host tĩnh nào (GitHub Pages, Netlify…) mà không phải cấu hình thêm.

## Cấu trúc thư mục

```
src/
├── App.tsx                 # khai báo route
├── types.ts                # kiểu câu hỏi, Part, Bank, Prio và nhãn hiển thị
├── store/AppContext.tsx    # trạng thái chung: cài đặt, lượt làm bài, lịch sử, sổ câu sai
├── pages/                  # Home, Quiz, Result, Learn, Browse, History, Settings
├── components/
│   ├── QuestionView.tsx    # hiển thị và chấm từng dạng câu
│   └── lesson/             # Tex (KaTeX), Rich (chữ + chú giải), SimHost, FlashCards, lesson.css
├── data/
│   ├── part1.ts … part4.ts # đề giữa kỳ
│   ├── explanations.ts     # giải thích đáp án đề giữa kỳ
│   ├── cv/dayNN.ts         # đề Phase 2 theo buổi (dựng bằng cv/make.ts)
│   └── lessons/            # nội dung sổ ôn
│       ├── days.ts, overview.ts, glossary.ts   # sổ CV
│       ├── p1/                                  # sổ Phase 1
│       └── index.ts        # BOOKS: danh sách sổ, tra bài theo id
├── lessons/
│   ├── sims.js             # mô phỏng sổ CV
│   └── sims-p1.js          # mô phỏng sổ Phase 1
└── lib/
    ├── grading.ts          # chấm điểm
    ├── sets.ts             # chọn câu theo phạm vi, đề ngẫu nhiên, câu còn lại
    ├── gloss.ts            # chú giải thuật ngữ tự động
    ├── indent.ts           # Tab / Shift+Tab trong ô nhập
    └── storage.ts          # đọc/ghi localStorage, xuất/nhập JSON
```

## Thêm hoặc sửa nội dung

**Câu hỏi giữa kỳ**: sửa `src/data/partN.ts`, giải thích ở `src/data/explanations.ts`.

**Câu hỏi Phase 2**:
- Thêm vào `src/data/cv/dayNN.ts` bằng các hàm dựng trong `make.ts`.
- `id` có dạng `d<ngày>-<số>`.
- Mỗi câu cần `prio` (1–3) và lời giải thích.

**Một buổi mới**:
1. Thêm số buổi vào `Part`, `PART_LABEL` và `BANK_PARTS` trong `src/types.ts`.
2. Thêm file đề vào `src/data/cv/index.ts`.
3. Viết bài vào `src/data/lessons/` và mô phỏng (cùng `id`) vào `src/lessons/`.

**Sổ Phase 1**:
- `src/data/lessons/p1/*` và `src/lessons/sims-p1.js` là file sinh ra bằng script `to-app.js` từ nguồn của artifact "Sổ ôn Nền tảng AI".
- Muốn sửa lâu dài thì sửa ở nguồn rồi chạy lại script. Sửa thẳng vào các file này sẽ bị ghi đè ở lần sinh sau.

**Thuật ngữ**:
- Mỗi sổ có `glossary.ts` dạng `[thuật ngữ, giải thích, cờ 'i'?, lookahead?]`.
- Sổ Phase 1 có thêm bảng `P1_VI` ánh xạ tiếng Việt → tiếng Anh.

Sau khi sửa, chạy `npm test`. Test kiểm tra:
- mọi buổi đủ trường và có mô phỏng;
- mọi công thức render được bằng KaTeX;
- quy tắc chú giải.

## Dữ liệu người dùng

Mọi thứ lưu trong `localStorage` với tiền tố `aia.v1.`:

| Khoá | Nội dung |
| --- | --- |
| `settings` | giao diện, bảng màu, số giây/câu, xáo trộn, số lần đúng để rời sổ sai |
| `session`, `last` | lượt đang làm, lượt vừa nộp |
| `history` | 200 lượt gần nhất |
| `wrong` | sổ câu sai |
| `seen` | các câu đã gặp |
| `bank`, `learnBook`, `lessonKnown` | nhóm đề và sổ ôn đang chọn, các thẻ "Đã nhớ" |

Dữ liệu chỉ nằm trên trình duyệt đang dùng. Muốn chuyển sang máy khác thì vào **Cài đặt → Xuất JSON**, rồi **Nhập JSON** ở máy mới.

## Ghi chú

- Câu hỏi giữa kỳ lấy từ file `DE_THI_GIUA_KY_96_CAU_FULL_DAP_AN.docx`. Câu hỏi và sổ ôn Phase 2 soạn từ tài liệu bài giảng. Đáp án nhiễu và lời giải thích do AI soạn, có thể còn sai sót.
- Lỗi đã biết và lỗi đã sửa được ghi ở [`BUGS.md`](BUGS.md).
