# Nhật Ký AI Audit - Phiên 003: Pipeline Kiểm Thử API 1 (FR-02 Login) (Phase 3)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T12:46 -> 2026-09-01T12:53 (GMT+7)
- **Mục đích:** Thực hiện đầy đủ 15 bước kiểm thử chuẩn hóa cho API 1 (`POST /api/login`), bao gồm sinh test cases có cấu trúc, thẩm định human audit, mở rộng test cases bởi con người, cài đặt Postman, chạy Newman và phân tích lỗi thực tế.

---

## 1. Nội dung Tương tác & Quy trình Thực hiện

### Bước 1: Điều phối Sinh Test Cases bằng AI (AI Generation)
- Không dùng prompt đơn lẻ, chia nhỏ quá trình sinh thành 4 nhóm kỹ thuật:
  1. *Domain & Boundary:* 22 test cases bao phủ email hợp lệ/không hợp lệ, rỗng, null, whitespace, độ dài biên, password đúng/sai, hoa/thường, trường thừa.
  2. *State Transitions (Lockout):* 6 test cases kiểm thử chu kỳ đăng nhập sai: lần 1 $\rightarrow$ lần 2 $\rightarrow$ lần 3 $\rightarrow$ kích hoạt khóa $\rightarrow$ thử đúng khi bị khóa $\rightarrow$ reset trạng thái.
  3. *Security & SQLi (SEC-01 & SEC-05):* 7 test cases kiểm tra SQL injection trong email/pass, UNION SELECT, comment syntax, NoSQL/Object injection, Content-Type tampering, và kiểm định không lộ mật khẩu.
  4. *Schema Validation:* 3 test cases kiểm tra cấu trúc JWT token (3 phần tách bởi dấu chấm), schema user object `{id, name, email, role}`, và thông điệp thành công.
- **Tổng số test cases do AI sinh ra:** 38 ca kiểm thử (TC-A01 $\rightarrow$ TC-A38).

### Bước 2: Thẩm định của Con người (Human Audit)
- Đánh giá từng test case theo 3 nhãn:
  - `VALID`: 36 test cases được xác nhận đúng chuẩn đặc tả.
  - `INCOMPLETE`: 2 test cases (TC-A17 và TC-A22) được hiệu chỉnh:
    - *TC-A17:* AI ban đầu chỉ assert status 200. Hiệu chỉnh: Bổ sung assertion `user.role === 'user'` để kiểm tra chặt chẽ việc không bị leo thang đặc quyền (Privilege Escalation) qua request body.
    - *TC-A22:* AI kỳ vọng 200 cứng khi email có khoảng trắng. Hiệu chỉnh: Kiểm tra cơ chế trim chuỗi hoặc từ chối hợp lệ.
  - `INVALID`: 0 test case.

### Bước 3: Mở rộng Ca Kiểm thử bởi Con người (Human Extension)
- Con người thiết kế và bổ sung **6 ca kiểm thử nâng cao** (TC-EXT-01 $\rightarrow$ TC-EXT-06):
  1. *TC-EXT-01:* Case-insensitive email authentication (`TEST@ESHOP.COM`). Lý giải AI bỏ sót: AI thiên lệch so khớp chuỗi `===` đơn thuần, thiếu hiểu biết về tiêu chuẩn RFC email.
  2. *TC-EXT-02:* Giải mã Base64 payload của JWT Token và đối sánh claims `{id, role}` với đối tượng user. Lý giải AI bỏ sót: AI thiếu kỹ năng tích hợp script xử lý Base64 phức tạp trong test assertion.
  3. *TC-EXT-03:* Kiểm thử phòng thủ cú pháp JSON hỏng (Malformed JSON body) để ngăn chặn crash parser.
  4. *TC-EXT-04:* Kiểm thử chênh lệch thời gian phản hồi (Timing attack defense) giữa email tồn tại và không tồn tại.
  5. *TC-EXT-05:* Đăng nhập với email chứa ký tự Unicode tiếng Việt có dấu.
  6. *TC-EXT-06:* Kiểm tra chu kỳ tự động mở khóa theo thời gian sau khi hết hạn 30 giây.
- **Tổng số test cases thực tế cho API 1:** 44 ca kiểm thử.

### Bước 4: Thực thi Kiểm thử với Postman & Newman
- Cài đặt toàn bộ 44 test cases vào `collections/Postman_Collection.json` dưới thư mục `01. Pool A - FR-02 Login`.
- Chạy Newman HTML Report:
  ```bash
  node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json -r cli,htmlextra --reporter-htmlextra-export reports/newman_fr02.html
  ```
- **Kết quả thực thi:**
  - Tổng số requests: 46 (1 health check + 1 setup + 44 tests)
  - Tổng số assertions: 63
  - Assertions Passed: 59 (93.7%)
  - Assertions Failed: 4 (6.3%)
  - Báo cáo HTML được sinh thành công: `reports/newman_fr02.html`.

### Bước 5: Phân tích Thất bại & Xác nhận Bug Thực tế
- Con người đối chiếu 4 assertions thất bại với tài liệu đặc tả và mã nguồn SUT, xác nhận 4 bug thực tế:
  1. `BUG-01` (Major): Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1), khóa tài khoản chỉ sau 2 lần nhập sai.
  2. `BUG-02` (Medium): Thời gian khóa tài khoản bị cấu hình 180 giây (3 phút) thay vì 30 giây theo FR-02.
  3. `BUG-03` (Critical - Security): Lỗ hổng SEC-01 nghiêm trọng - Endpoint `/api/login` trả về nguyên văn mật khẩu plaintext trong trường `user.password`.
  4. `BUG-04` (Minor): Không hỗ trợ đăng nhập với email dạng chữ hoa.
- Toàn bộ bug được lập hồ sơ chi tiết trong `bug_report.md`.

---

## 2. Thẩm định & Đánh giá Bloom-AI
- Đạt mức **G9.3 (Analyse)** qua việc audit phân loại nhãn và phân tích root-cause của các failure.
- Đạt mức **G9.4 (Collaborate)** qua việc bổ sung 6 ca kiểm thử con người thiết kế bù đắp các lỗ hổng nhận thức của AI.
