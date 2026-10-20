# Danh sách lỗi cần sửa

Chỉ sửa khi người dùng yêu cầu. Mỗi lỗi sửa xong thì commit + push riêng.

## Đang mở

### BUG-1 · Phím Tab trong ô nhập đáp án chuyển focus thay vì thụt lề
- **Nơi xảy ra:** ô nhập tự luận (`<textarea>` trong câu dạng `open`, `src/components/QuestionView.tsx`), có thể cả ô điền khuyết.
- **Hiện tượng:** khi gõ đáp án dạng code/thuộc tính (vd JSON, system prompt, code Python), bấm Tab thì con trỏ nhảy sang các phần bên dưới (nút "Xem đáp án mẫu", danh sách câu…) thay vì chèn khoảng thụt lề để tiếp tục gõ.
- **Mong muốn:** Tab trong ô nhập chèn thụt lề (2 hoặc 4 dấu cách); vẫn phải có cách thoát bàn phím (vd Esc rồi Tab, hoặc Shift+Tab) để không bẫy người dùng bàn phím (WCAG 2.1.2).
- **Ghi nhận:** 2026-10-20 · Trạng thái: chưa sửa.

## Đã sửa

_(chưa có)_
