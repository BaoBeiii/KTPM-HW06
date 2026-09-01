# Danh Sách GitHub Issues — Báo Cáo Lỗi Hệ Thống EShop API

- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Đồ án:** Kiểm thử phần mềm (HW06)
- **Tổng số lỗi hệ thống được xác nhận:** 13 lỗi (3 Critical, 7 Major, 3 Medium)

---

## Bảng Tổng Hợp 13 GitHub Issues Đã Tạo

| Issue ID | Mã Lỗi | Tiêu Đề GitHub Issue | API Bị Ảnh Hưởng | Mức Độ (Severity) | Nhãn (Labels) | Tệp Chi Tiết |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| #1 | `BUG-01` | [[BUG][Major][FR-02] Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1)](./ISSUE-01-BUG-01-login-attempts-increment.md) | `POST /api/login` | **Major** | `bug, backend, authentication, p2-major` | [`ISSUE-01-BUG-01-login-attempts-increment.md`](./ISSUE-01-BUG-01-login-attempts-increment.md) |
| #2 | `BUG-02` | [[BUG][Medium][FR-02] Thời gian khóa tài khoản bị cấu hình sai (180 giây thay vì 30 giây)](./ISSUE-02-BUG-02-lockout-duration-misconfiguration.md) | `POST /api/login` | **Medium** | `bug, backend, configuration, p3-medium` | [`ISSUE-02-BUG-02-lockout-duration-misconfiguration.md`](./ISSUE-02-BUG-02-lockout-duration-misconfiguration.md) |
| #3 | `BUG-03` | [[BUG][Critical][SEC-01] Vi phạm bảo mật nghiêm trọng SEC-01 — Để lộ Plaintext Password trong API Login](./ISSUE-03-BUG-03-plaintext-password-leak.md) | `POST /api/login` | **Critical** | `bug, security, vulnerability, p1-critical` | [`ISSUE-03-BUG-03-plaintext-password-leak.md`](./ISSUE-03-BUG-03-plaintext-password-leak.md) |
| #4 | `BUG-04` | [[BUG][Medium][FR-02] Email trong API Login phân biệt hoa/thường sai chuẩn RFC (Case-sensitive email login)](./ISSUE-04-BUG-04-case-sensitive-email.md) | `POST /api/login` | **Medium** | `bug, backend, rfc-compliance, p3-medium` | [`ISSUE-04-BUG-04-case-sensitive-email.md`](./ISSUE-04-BUG-04-case-sensitive-email.md) |
| #5 | `BUG-05` | [[BUG][Critical][FR-08] Lỗ hổng Price Tampering nghiêm trọng — Backend tin tưởng giá trị total_amount gửi lên từ Client](./ISSUE-05-BUG-05-price-tampering.md) | `POST /api/checkout` | **Critical** | `bug, security, business-logic, p1-critical` | [`ISSUE-05-BUG-05-price-tampering.md`](./ISSUE-05-BUG-05-price-tampering.md) |
| #6 | `BUG-06` | [[BUG][Major][FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công](./ISSUE-06-BUG-06-cart-not-cleared.md) | `POST /api/checkout` | **Major** | `bug, backend, state-management, p2-major` | [`ISSUE-06-BUG-06-cart-not-cleared.md`](./ISSUE-06-BUG-06-cart-not-cleared.md) |
| #7 | `BUG-07` | [[BUG][Major][FR-08] Cho phép tạo đơn hàng khi giỏ hàng rỗng](./ISSUE-07-BUG-07-empty-cart-checkout.md) | `POST /api/checkout` | **Major** | `bug, backend, business-logic, p2-major` | [`ISSUE-07-BUG-07-empty-cart-checkout.md`](./ISSUE-07-BUG-07-empty-cart-checkout.md) |
| #8 | `BUG-08` | [[BUG][Major][FR-08] Thiếu hoàn toàn Validation dữ liệu đầu vào trên Endpoint Checkout](./ISSUE-08-BUG-08-missing-input-validation-checkout.md) | `POST /api/checkout` | **Major** | `bug, backend, input-validation, p2-major` | [`ISSUE-08-BUG-08-missing-input-validation-checkout.md`](./ISSUE-08-BUG-08-missing-input-validation-checkout.md) |
| #9 | `BUG-09` | [[BUG][Major][FR-08] Lỗ hổng Overselling & Tồn kho âm khi kiểm thử tương tranh (Concurrency Race Condition)](./ISSUE-09-BUG-09-concurrency-overselling-stock.md) | `POST /api/checkout` | **Major** | `bug, concurrency, inventory, p2-major` | [`ISSUE-09-BUG-09-concurrency-overselling-stock.md`](./ISSUE-09-BUG-09-concurrency-overselling-stock.md) |
| #10 | `BUG-10` | [[BUG][Critical][FR-14][SEC-03] Lỗ hổng Phân quyền Broken Function Level Authorization (BFLA) trên các Endpoint Quản lý Danh mục](./ISSUE-10-BUG-10-bfla-category-crud.md) | `POST/PUT/DELETE /api/categories` | **Critical** | `bug, security, bfla, owasp-top-10, p1-critical` | [`ISSUE-10-BUG-10-bfla-category-crud.md`](./ISSUE-10-BUG-10-bfla-category-crud.md) |
| #11 | `BUG-11` | [[BUG][Major][FR-14] Thiếu hoàn toàn Validation Dữ liệu Tên Danh mục trên POST và PUT /api/categories](./ISSUE-11-BUG-11-missing-input-validation-category.md) | `POST /api/categories, PUT /api/categories/:id` | **Major** | `bug, backend, input-validation, p2-major` | [`ISSUE-11-BUG-11-missing-input-validation-category.md`](./ISSUE-11-BUG-11-missing-input-validation-category.md) |
| #12 | `BUG-12` | [[BUG][Medium][FR-14] Vi phạm Chuẩn RESTful — Endpoint PUT và DELETE luôn trả về 200 OK khi ID Danh mục không tồn tại](./ISSUE-12-BUG-12-restful-404-category.md) | `PUT /api/categories/:id, DELETE /api/categories/:id` | **Medium** | `bug, backend, restful-standards, p3-medium` | [`ISSUE-12-BUG-12-restful-404-category.md`](./ISSUE-12-BUG-12-restful-404-category.md) |
| #13 | `BUG-13` | [[BUG][Major][FR-14] Vi phạm Tính Toàn Vẹn Quan Hệ (Referential Integrity) khi Xóa Danh mục Đang Chứa Sản phẩm](./ISSUE-13-BUG-13-referential-integrity-category.md) | `DELETE /api/categories/:id` | **Major** | `bug, database, referential-integrity, p2-major` | [`ISSUE-13-BUG-13-referential-integrity-category.md`](./ISSUE-13-BUG-13-referential-integrity-category.md) |

---

## Hướng Dẫn Sử Dụng
Các tệp báo cáo lỗi trong thư mục này được định dạng theo đúng chuẩn GitHub Issue Template (`.github/ISSUE_TEMPLATE/bug_report.md`). Có thể đẩy trực tiếp lên GitHub Repository thông qua GitHub CLI (`gh issue create`) hoặc thông qua giao diện Web của GitHub.
