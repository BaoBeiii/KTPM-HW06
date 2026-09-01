# Nhật Ký AI Audit - Phiên 004: Pipeline Kiểm Thử API 2 (FR-08 Checkout) (Phase 4)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T12:58 -> 2026-09-01T13:03 (GMT+7)
- **Mục đích:** Thực hiện đầy đủ pipeline kiểm thử chuẩn hóa cho API 2 (`POST /api/checkout`), bao gồm sinh test cases có cấu trúc, thẩm định human audit, mở rộng test cases do con người thiết kế, cài đặt Postman, chạy Newman và phân tích lỗi thực tế trên hệ thống.

---

## 1. Nội dung Tương tác & Quy trình Thực hiện

### Bước 1: Điều phối Sinh Test Cases bằng AI (AI Generation)
- Thiết kế 36 ca kiểm thử chia thành các nhóm:
  1. *Domain & Boundary (total_amount & shipping_address):* 22 test cases bao phủ giá trị tiền dương, số thực, 0, âm, kiểu chuỗi, boolean, null, tràn số $10^{12}$, thiếu trường, địa chỉ chuẩn, rỗng, khoảng trắng, kiểu số, ký tự đặc biệt, Unicode tiếng Việt, body rỗng, và inject trường thừa `status: delivered`.
  2. *State Transitions & Cart Dependency:* 6 test cases kiểm tra tương tác dữ liệu liên hoàn giữa giỏ hàng (`POST /api/cart`), thanh toán (`POST /api/checkout`), kiểm tra giỏ rỗng (`GET /api/cart`), và kiểm tra đơn hàng tạo mới có `status = 'pending'` (`GET /api/orders/my-orders`).
  3. *Security & Price Tampering (SEC-02, SEC-04, SEC-05):* 7 test cases kiểm tra xác thực Bearer Token, chữ ký số giả mạo, Stored XSS trong địa chỉ giao hàng, HTML injection, SQLi, và đặc biệt là kịch bản tấn công Price Tampering (client cố tình gửi giá 1,000đ khi giỏ hàng có sản phẩm 30,000,000đ).
  4. *Schema Validation:* 1 test case kiểm tra cấu trúc response `{message: "Checkout successful", orderId}`.
- **Tổng số test cases do AI sinh ra:** 36 ca kiểm thử (TC-B01 $\rightarrow$ TC-B36).

### Bước 2: Thẩm định của Con người (Human Audit)
- Đánh giá từng ca kiểm thử theo 3 nhãn:
  - `VALID`: 34 test cases phù hợp 100% với đặc tả FR-08 và SRS.
  - `INCOMPLETE`: 2 test cases được hiệu chỉnh chặt chẽ:
    - *TC-B06:* Xác định rõ backend cần xử lý strict type hay ép kiểu số.
    - *TC-B22:* Hiệu chỉnh bắt buộc gọi `GET /api/orders/my-orders` để đảm bảo đơn hàng không bị client gán đè `status: delivered` (Mass Assignment).
  - `INVALID`: 0 test case.

### Bước 3: Mở rộng Ca Kiểm thử bởi Con người (Human Extension)
- Con người bổ sung **6 ca kiểm thử nâng cao** (TC-EXT-07 $\rightarrow$ TC-EXT-12):
  1. *TC-EXT-07 (Free Order Exploit):* Client cố tình gửi `total_amount = 0` khi giỏ hàng có giá trị cao. Lý do AI bỏ sót: AI chỉ test số ngẫu nhiên, không nghĩ đến vector tấn công mua hàng 0 đồng.
  2. *TC-EXT-08 (Cart State Persistence Check):* Chuỗi 3 requests liên hoàn xác minh giỏ hàng bị xóa sạch sau checkout. Lý do AI bỏ sót: AI kiểm thử đơn lẻ từng endpoint.
  3. *TC-EXT-09 (BOLA/IDOR Injected user_id):* Gửi kèm `user_id: 9999` trong body checkout để xem server có gán đơn cho người khác không.
  4. *TC-EXT-10 (Stored XSS Retrieval Check):* Kiểm tra XSS khi đọc lại danh sách đơn hàng qua `GET /api/orders/my-orders`.
  5. *TC-EXT-11 (Content-Type Tampering):* Gửi body `x-www-form-urlencoded`.
  6. *TC-EXT-12 (Concurrency / Double Submit):* Gửi 2 request checkout liên tiếp cực nhanh trên cùng giỏ hàng.
- **Tổng số test cases thực tế cho API 2:** 42 ca kiểm thử.

### Bước 4: Thực thi Kiểm thử với Postman & Newman
- Cập nhật `scripts/build_collection.js` để nạp toàn bộ 42 tests vào `02. Pool B - FR-08 Checkout`.
- Chạy Newman HTML Report:
  ```bash
  node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json --folder "02. Pool B - FR-08 Checkout" -r cli,htmlextra --reporter-htmlextra-export reports/newman_fr08.html
  ```
- **Kết quả thực thi:**
  - Tổng số requests: 48
  - Tổng số assertions: 56
  - Assertions Passed: 40
  - Assertions Failed: 16
  - Báo cáo HTML được sinh thành công: `reports/newman_fr08.html`.

### Bước 5: Phân tích Thất bại & Xác nhận Bug Thực tế
- Phân tích 16 assertions thất bại và đối chiếu với mã nguồn `server.js` (dòng 297-309), con người xác nhận 4 nhóm bug nghiêm trọng:
  1. `BUG-05` (Critical - Business Logic): Lỗ hổng Price Tampering nghiêm trọng - Backend nhận trực tiếp `total_amount` từ client và lưu vào DB mà không tự tính toán lại từ giỏ hàng, vi phạm trực tiếp đặc tả FR-08.
  2. `BUG-06` (Major - State Management): Giỏ hàng không hề được làm rỗng sau khi thanh toán thành công, vi phạm đặc tả FR-08 ("Sau thanh toán thành công, giỏ hàng được xóa").
  3. `BUG-07` (Major - Business Logic): Cho phép đặt hàng thành công khi giỏ hàng rỗng (`userCarts = []`).
  4. `BUG-08` (Major - Input Validation): Thiếu hoàn toàn cơ chế kiểm tra dữ liệu đầu vào trên `/api/checkout` (chấp nhận tiền âm, tiền bằng 0, địa chỉ rỗng, null, khoảng trắng).
- Tất cả các lỗi đã được cập nhật chi tiết vào `bug_report.md`.

---

## 2. Thẩm định & Đánh giá Bloom-AI
- Đạt mức **G9.3 (Analyse)** qua việc phát hiện các lỗi nghiêm trọng về logic nghiệp vụ và quản lý trạng thái giỏ hàng.
- Đạt mức **G9.4 (Collaborate)** qua việc bổ sung 6 ca kiểm thử chuyên sâu mà AI bỏ sót, đặc biệt là kịch bản khai thác đơn hàng 0 đồng và kiểm tra tính toàn vẹn trạng thái giỏ hàng.
