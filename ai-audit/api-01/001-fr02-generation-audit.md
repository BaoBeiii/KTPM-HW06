# Nhật Ký AI Audit - Phiên 003: Pipeline Kiểm Thử API 1 (FR-02 Login) (Phase 3)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T12:46 -> 2026-09-01T12:53 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Thực hiện đầy đủ 15 bước kiểm thử chuẩn hóa cho API 1 (`POST /api/login`), bao gồm sinh test cases có cấu trúc, thẩm định human audit, mở rộng test cases bởi con người, cài đặt Postman, chạy Newman và phân tích lỗi thực tế.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 3 cho API 1: FR-02 Đăng nhập (POST /api/login). Áp dụng quy trình AI-First theo 4 kỹ thuật (EP/BVA, State Transition, Security, Schema), thẩm định audit và mở rộng ít nhất 5 test cases."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- AI thực hiện sinh 38 ca kiểm thử sơ bộ (TC-A01 $\rightarrow$ TC-A38) chia theo 4 nhóm kỹ thuật.
- Cài đặt các kịch bản test script Javascript cơ bản kiểm tra status code và response body.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Người dùng đã trực tiếp giám sát, kiểm toán và yêu cầu hiệu chỉnh qua **5 khúc sửa cụ thể**:

### Khúc Sửa 1: Hiệu chỉnh ca kiểm thử TC-A17 (Phòng ngừa Leo thang Đặc quyền - Privilege Escalation)
- **Vấn đề phát hiện trong Audit:** AI ban đầu chỉ assert đơn giản `pm.response.to.have.status(200)` khi gửi body có kèm trường `role: "admin"`. Điều này không phát hiện được nếu backend bị lỗi cho phép user tự phong quyền admin cho mình.
- **Hành động hiệu chỉnh của AI:** Sửa TC-A17, bổ sung assertion bắt buộc `pm.expect(data.user.role).to.equal('user')` để đảm bảo hệ thống không bị tấn công Parameter Tampering/Privilege Escalation.

### Khúc Sửa 2: Hiệu chỉnh ca kiểm thử TC-A22 (Xử lý khoảng trắng đầu/cuối trong Email)
- **Vấn đề phát hiện trong Audit:** AI kỳ vọng server trả về 200 cứng khi email có khoảng trắng `" test@eshop.com "`.
- **Hành động hiệu chỉnh của AI:** Hiệu chỉnh lại assertion để kiểm tra cơ chế trim chuỗi của backend hoặc từ chối hợp lệ, tránh gây false positive.

### Khúc Sửa 3: Mở rộng 6 ca kiểm thử chuyên sâu khắc phục điểm mù của AI (Human Extensions)
- **Yêu cầu phản biện:** AI chỉ tập trung vào các luồng kiểm thử cơ bản bề mặt. Con người trực tiếp thiết kế và bổ sung 6 ca kiểm thử nâng cao:
  1. *TC-EXT-01:* Kiểm tra email không phân biệt hoa thường theo chuẩn RFC 5321 (`TEST@ESHOP.COM`).
  2. *TC-EXT-02:* Giải mã Base64 payload của JWT Token và đối sánh claims `{id, role}` với user object.
  3. *TC-EXT-03:* Tấn công bằng Malformed JSON Body để kiểm tra khả năng phục hồi của server.
  4. *TC-EXT-04:* Kiểm tra phòng thủ tấn công kênh phụ (Timing Attack side-channel) giữa email có sẵn và không có sẵn.
  5. *TC-EXT-05:* Đăng nhập với ký tự tiếng Việt Unicode UTF-8 có dấu.
  6. *TC-EXT-06:* Kiểm tra chu kỳ tự động mở khóa theo thời gian thực (Time Expiration Lockout).

### Khúc Sửa 4: Phân tích nguyên nhân mã nguồn và trích xuất 4 lỗi hệ thống thực tế
- **Yêu cầu phân tích:** Kết quả Newman chạy thực tế phát hiện 4 assertions failed. AI được chỉ đạo soi chiếu trực tiếp vào `eshop-sut/backend/server.js` để tìm dòng mã lỗi gốc:
  - `BUG-01`: Dòng 54 thực hiện `user.login_attempts + 2` thay vì `+ 1`.
  - `BUG-02`: Dòng 57 cấu hình khóa `180000ms` (3 phút) thay vì `30000ms` (30 giây).
  - `BUG-03`: Dòng 35 & 52 để lộ Plaintext Password `user.password` trong response body (SEC-01).
  - `BUG-04`: Dòng 35 thiếu `LOWER(email)` khiến email bị phân biệt hoa thường sai chuẩn RFC.

### Khúc Sửa 5: Điều chỉnh kịch bản Lockout tránh khóa oan tài khoản Admin dùng chung
- **Vấn đề phát hiện:** Khi chạy kiểm thử chu kỳ khóa tài khoản bằng `admin@eshop.com`, tài khoản Admin bị khóa 3 phút làm cho các request của API 3 (FR-14 Category CRUD) ở các phase sau bị từ chối 403 Forbidden.
- **Hành động hiệu chỉnh của AI:** Điều chỉnh các test case lockout (TC-A10, TC-A11, TC-A30, TC-A31) sang email dummy (`lockout_test@eshop.com`), bảo vệ an toàn cho tài khoản Admin trong toàn bộ vòng đời kiểm thử.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.4 (Collaborate)** — Phối hợp nhịp nhàng giữa tốc độ sinh test của AI và năng lực phản biện, phân tích mã nguồn và bảo mật sâu sắc của con người.
