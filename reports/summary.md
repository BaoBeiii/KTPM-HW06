# Báo Cáo Tổng Hợp Kết Quả Thực Thi Kiểm Thử Newman Toàn Hệ Thống (Newman Execution Summary)

- **Mã số sinh viên:** `23127327`
- **Họ và tên sinh viên:** `Lưu Ngô Quốc Bảo`
- **Môn học:** Kiểm thử phần mềm (Software Testing - HW06)
- **Thời gian thực thi:** 2026-09-01T13:42:24 (GMT+7)
- **Môi trường thực thi:**
  - Hệ điều hành: Windows 11
  - Node.js Runtime: `v24.11.0`
  - Newman CLI: `v6.2.1`
  - HTML Extra Reporter: `newman-reporter-htmlextra v1.23.1`
  - SUT Backend: Node.js Express REST API (`http://localhost:3000`)
  - Cơ sở dữ liệu: SQLite3 (`eshop-sut/backend/database.sqlite`)

---

## 1. Thống Kê Tổng Quan Bộ Ca Kiểm Thử (Full Test Suite Metrics)

| Hạng mục / Phân hệ | Endpoint chính | Số Requests | Số Assertions | Assertions Passed | Assertions Failed | Tỷ lệ Pass (%) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **00. Health Check** | `GET /api/products` | 1 | 1 | 1 | 0 | 100.0% |
| **01. Pool A (FR-02)** | `POST /api/login` | 46 | 68 | 64 | 4 | 94.1% |
| **02. Pool B (FR-08)** | `POST /api/checkout` | 48 | 56 | 39 | 17 | 69.6% |
| **03. Pool C (FR-14)** | `GET/POST/PUT/DELETE /api/categories` | 47 | 54 | 35 | 19 | 64.8% |
| **TỔNG CỘNG HỆ THỐNG** | **3 Phân hệ hoàn chỉnh** | **142** | **179** | **139** | **40** | **77.7%** |

---

## 2. Báo Cáo Chi Tiết Từng Phân Hệ API

### 2.1. Phân hệ 01: Pool A - FR-02 Đăng Nhập (`POST /api/login`)
- **Số ca kiểm thử:** 44 ca kiểm thử (38 AI-generated + 6 Human Extensions).
- **Kết quả Assertions:** 64 Passed / 4 Failed.
- **Phân tích 4 lỗi phát hiện:**
  1. `BUG-01` (Critical - SEC-01): Lộ mật khẩu plaintext trong trường `user.password` của response body `200 OK`.
  2. `BUG-02` (High - SEC-01): Lộ mã hash mật khẩu trong body phản hồi khi đăng nhập thành công.
  3. `BUG-03` (Medium - RFC 5321): Phân biệt hoa thường không chuẩn trong địa chỉ email (`TEST@ESHOP.COM` không đăng nhập được tài khoản `test@eshop.com`).
  4. `BUG-04` (Medium - Logic): Chênh lệch thời gian phản hồi (Timing Attack side-channel) giữa tài khoản tồn tại và không tồn tại.
- **Báo cáo HTML riêng:** [`reports/newman_fr02.html`](newman_fr02.html).

### 2.2. Phân hệ 02: Pool B - FR-08 Đặt Hàng / Thanh Toán (`POST /api/checkout`)
- **Số ca kiểm thử:** 43 ca kiểm thử (36 AI-generated + 7 Human Extensions).
- **Kết quả Assertions:** 39 Passed / 17 Failed.
- **Phân tích 17 assertions thất bại (tương ứng 5 nhóm bug):**
  1. `BUG-05` (Critical - Business Logic): Lỗ hổng Price Tampering nghiêm trọng - Backend nhận trực tiếp `total_amount` từ client mà không tự tính toán lại từ giỏ hàng. Cho phép khai thác đơn hàng 0 đồng (`TC-EXT-07`).
  2. `BUG-06` (Major - State Management): Giỏ hàng không hề được làm rỗng sau khi thanh toán thành công, vi phạm trực tiếp đặc tả FR-08.
  3. `BUG-07` (Major - Business Logic): Cho phép đặt hàng thành công khi giỏ hàng rỗng (`userCarts = []`).
  4. `BUG-08` (Major - Input Validation): Endpoint checkout chấp nhận `total_amount` âm, bằng 0, null; `shipping_address` rỗng, khoảng trắng, kiểu số; body rỗng `{}` mà vẫn trả về `200 OK`.
  5. `BUG-09` (Major - Concurrency & Inventory Control): Bán vượt quá số lượng hàng có sẵn (Overselling) và nguy cơ âm kho (`TC-EXT-13`). Khi sản phẩm chỉ còn số lượng 1, hệ thống không có khóa tương tranh (Locking) nên cho phép cả 2 người dùng thanh toán cùng lúc thành công.
- **Báo cáo HTML riêng:** [`reports/newman_fr08.html`](newman_fr08.html).

### 2.3. Phân hệ 03: Pool C - FR-14 Quản Lý Danh Mục CRUD (`/api/categories`)
- **Số ca kiểm thử:** 44 ca kiểm thử (38 AI-generated + 6 Human Extensions).
- **Kết quả Assertions:** 35 Passed / 19 Failed.
- **Phân tích 19 assertions thất bại (tương ứng 4 nhóm bug):**
  1. `BUG-10` (Critical - Broken Access Control / BFLA): Endpoint POST, PUT, DELETE không kiểm tra quyền Quản trị viên (`req.user.role === 'admin'`). Người dùng bình thường (`role: 'user'`) có thể tự do thêm, sửa, xóa toàn bộ danh mục của hệ thống (vi phạm FR-12 và SEC-03).
  2. `BUG-11` (Major - Input Validation): Chấp nhận tạo và cập nhật danh mục với tên là chuỗi rỗng `""`, null, khoảng trắng `"   "`, hoặc kiểu số.
  3. `BUG-12` (Medium - RESTful Semantic): Endpoint PUT và DELETE /api/categories/:id luôn trả về `200 OK` kể cả khi ID danh mục không hề tồn tại trong CSDL (lẽ ra phải trả về `404 Not Found`).
  4. `BUG-13` (Major - Referential Data Integrity): Cho phép xóa trực tiếp danh mục đang chứa sản phẩm liên kết (ID 1 "Điện thoại"), tạo ra các bản ghi mồ côi (Orphaned Records) trong bảng `products`.
- **Báo cáo HTML riêng:** [`reports/newman_fr14.html`](newman_fr14.html).

---

## 3. Danh Sách Các Báo Cáo HTML Trực Quan Đã Xuất

1. **Báo cáo Toàn Bộ Hệ Thống (Consolidated Full Suite):** [`reports/newman_full_suite.html`](newman_full_suite.html) (2.93 MB)
2. **Báo cáo Phân hệ Pool A (FR-02 Login):** [`reports/newman_fr02.html`](newman_fr02.html)
3. **Báo cáo Phân hệ Pool B (FR-08 Checkout):** [`reports/newman_fr08.html`](newman_fr08.html)
4. **Báo cáo Phân hệ Pool C (FR-14 Category CRUD):** [`reports/newman_fr14.html`](newman_fr14.html)

---

## 4. Kết Luận
- 100% ca kiểm thử được thực thi tự động thông qua Newman CLI.
- Toàn bộ 40 thất bại đều phản ánh chính xác các lỗi nghiệp vụ và lỗ hổng bảo mật thực tế của SUT, được mô tả chi tiết và có mã minh chứng đối sánh trong file `bug_report.md`.
