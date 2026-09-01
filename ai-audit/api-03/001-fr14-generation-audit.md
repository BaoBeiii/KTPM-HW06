# Nhật Ký AI Audit - Phiên 004: Pipeline Kiểm Thử API 3 (FR-14 Category CRUD) (Phase 5)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T13:36 -> 2026-09-01T13:40 (GMT+7)
- **Mục đích:** Thực hiện đầy đủ 15 bước kiểm thử chuẩn hóa cho API 3 (`GET/POST/PUT/DELETE /api/categories`), bao gồm sinh test cases có cấu trúc, thẩm định human audit, mở rộng test cases bởi con người, cài đặt Postman, chạy Newman và phân tích lỗi thực tế.

---

## 1. Nội dung Tương tác & Quy trình Thực hiện

### Bước 1: Điều phối Sinh Test Cases bằng AI (AI Generation)
- Không dùng prompt đơn lẻ, chia nhỏ quá trình sinh thành 4 nhóm kỹ thuật:
  1. *Domain & Boundary:* 22 test cases bao phủ toàn diện các phương thức GET, POST, PUT, DELETE; các giá trị tên hợp lệ, rỗng, null, whitespace, độ dài biên (1, 255, 1000 ký tự), tiếng Việt Unicode, ID không tồn tại, ID âm, ID không phải số.
  2. *State Transitions & CRUD Lifecycle:* 6 test cases xâu chuỗi chu kỳ trọn vẹn: Tạo danh mục $\rightarrow$ Đọc kiểm tra tồn tại $\rightarrow$ Cập nhật tên $\rightarrow$ Đọc kiểm tra tên mới $\rightarrow$ Xóa danh mục $\rightarrow$ Đọc kiểm tra đã biến mất hoàn toàn.
  3. *Security & RBAC Authorization (SEC-02, SEC-03, SEC-04, SEC-05):* 9 test cases kiểm tra Broken Function Level Authorization (BFLA) khi user thường gọi POST/PUT/DELETE; Unauthenticated requests (thiếu token); Stored XSS trong trường name; SQL Injection trong body name và trong path parameter `:id`.
  4. *Schema Validation:* 1 test case kiểm tra cấu trúc mảng JSON danh mục trả về, từng đối tượng có `{id: number, name: string}`.
- **Tổng số test cases do AI sinh ra:** 38 ca kiểm thử (TC-C01 $\rightarrow$ TC-C38).

### Bước 2: Thẩm định của Con người (Human Audit)
- Đánh giá từng test case theo 3 nhãn:
  - `VALID`: 38 test cases (100%) được xác nhận phù hợp chặt chẽ với đặc tả FR-12, FR-14 và các yêu cầu phi chức năng SEC-02 $\rightarrow$ SEC-05.
  - `INCOMPLETE`: 0 test case.
  - `INVALID`: 0 test case.

### Bước 3: Mở rộng Ca Kiểm thử bởi Con người (Human Extension)
- Con người bổ sung **6 ca kiểm thử nâng cao** (TC-EXT-14 $\rightarrow$ TC-EXT-19):
  1. *TC-EXT-14 (Referential Integrity Check):* Thử xóa danh mục ID 1 đang chứa sản phẩm liên kết (iPhone 15, Samsung S24) để kiểm tra tính toàn vẹn quan hệ (Foreign Key Constraints). Lý do AI bỏ sót: AI chỉ kiểm thử độc lập trên danh mục rỗng tự tạo, không lường trước quan hệ khóa ngoại giữa các bảng.
  2. *TC-EXT-15 (Duplicate Category Name):* Thử tạo danh mục trùng tên ("Điện thoại"). Lý do AI bỏ sót: AI chỉ quan tâm cú pháp hợp lệ, bỏ qua quy tắc nghiệp vụ duy nhất (Uniqueness business rule).
  3. *TC-EXT-16 (Stored XSS HTML Injection Read-back):* Nạp payload XSS `<img src=x onerror=alert('XSS')>` qua POST và gọi GET /api/categories để kiểm tra cơ chế escape dữ liệu khi xuất ra giao diện. Lý do AI bỏ sót: AI thiếu kiểm thử vòng đời xuất dữ liệu (Output sanitization).
  4. *TC-EXT-17 (Malformed JSON Parser Defense):* Gửi body JSON lỗi cú pháp để kiểm tra server có xử lý an toàn không bị crash.
  5. *TC-EXT-18 (Path Traversal Defense on :id):* Gửi payload `%2e%2e%2f` trên tham số đường dẫn để phòng thủ Directory Traversal.
  6. *TC-EXT-19 (Case-Insensitive Uniqueness):* Kiểm tra phân biệt hoa thường ("Laptop" vs "laptop").
- **Tổng số test cases thực tế cho API 3:** 44 ca kiểm thử.

### Bước 4: Thực thi Kiểm thử với Postman & Newman
- Cập nhật `scripts/build_collection.js` để nạp toàn bộ 44 tests vào thư mục `03. Pool C - FR-14 Category CRUD`.
- Chạy Newman HTML Report:
  ```bash
  node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json --folder "03. Pool C - FR-14 Category CRUD" -r cli,htmlextra --reporter-htmlextra-export reports/newman_fr14.html
  ```
- **Kết quả thực thi:**
  - Tổng số requests: 47
  - Tổng số assertions: 54
  - Assertions Passed: 34
  - Assertions Failed: 20
  - Báo cáo HTML được sinh thành công: `reports/newman_fr14.html`.

### Bước 5: Phân tích Thất bại & Xác nhận Bug Thực tế
- Phân tích 20 assertions thất bại và đối chiếu với mã nguồn `server.js` (dòng 243-278), con người xác nhận 4 nhóm bug hệ thống nghiêm trọng:
  1. `BUG-10` (Critical - Broken Access Control / BFLA): Lỗ hổng phân quyền nghiêm trọng - Các endpoint `POST`, `PUT`, `DELETE /api/categories` chỉ dùng middleware `authenticateToken` mà không kiểm tra `req.user.role === 'admin'`. Người dùng thường (`role: 'user'`) có thể tự do thêm, sửa, xóa danh mục của hệ thống, vi phạm trực tiếp FR-12 và SEC-03.
  2. `BUG-11` (Major - Input Validation): Thiếu hoàn toàn kiểm tra hợp lệ dữ liệu tên danh mục trên POST và PUT (chấp nhận chuỗi rỗng, null, khoảng trắng, số).
  3. `BUG-12` (Medium - RESTful Semantic): Vi phạm chuẩn thiết kế RESTful - PUT và DELETE luôn trả về `200 OK` với thông báo thành công kể cả khi ID danh mục không hề tồn tại trong CSDL (lẽ ra phải trả về `404 Not Found`).
  4. `BUG-13` (Major - Data Integrity): Vi phạm tính toàn vẹn quan hệ (Referential Integrity) - Cho phép xóa trực tiếp danh mục đang chứa các sản phẩm liên kết, dẫn đến các bản ghi mồ côi (Orphaned Records) trong bảng `products`.
- Tất cả các lỗi đã được cập nhật chi tiết vào `bug_report.md`.

---

## 2. Thẩm định & Đánh giá Bloom-AI
- Đạt mức **G9.3 (Analyse)** qua việc phân tích mã nguồn và kiểm chứng các lỗi nghiêm trọng về phân quyền RBAC (BFLA), tính toàn vẹn dữ liệu quan hệ và chuẩn RESTful.
- Đạt mức **G9.4 (Collaborate)** qua việc con người phát hiện và bổ sung 6 ca kiểm thử chuyên sâu về khóa ngoại, trùng lặp nghiệp vụ và lọc xuất XSS mà AI bỏ sót.
