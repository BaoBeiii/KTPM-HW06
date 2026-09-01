# Nhật Ký AI Audit - Phiên 002: Phân Tích Đặc Tả & Chiến Lược Kiểm Thử 3 API (Phase 2)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T12:26 -> 2026-09-01T12:28 (GMT+7)
- **Mục đích:** Nghiên cứu đối chiếu chi tiết tài liệu `api_specification.md` và `README.md` để xây dựng tài liệu phân tích kỹ thuật và chiến lược kiểm thử toàn diện cho 3 API: FR-02, FR-08, FR-14.

---

## 1. Nội dung Tương tác & Phân tích

### Bước 1: Trích xuất Thông số Kỹ thuật & Ràng buộc Nghiệp vụ
- **API 1 (FR-02 Login):** Xác định cấu trúc request body `{email, password}`, phản hồi 200 OK trả về token JWT và user object. Ràng buộc đếm sai và lockout 30s. Ánh xạ bảo mật SEC-01 và SEC-05.
- **API 2 (FR-08 Checkout):** Xác định sự phụ thuộc giữa `POST /api/checkout` với `POST /api/cart` (nạp dữ liệu) và `GET /api/cart` (xác minh xóa giỏ hàng). Ràng buộc backend tự tính toán lại tổng tiền để chống Price Tampering. Ánh xạ bảo mật SEC-02 và SEC-04.
- **API 3 (FR-14 Category CRUD):** Xác định vòng đời quản lý danh mục (`POST`, `GET`, `PUT`, `DELETE`). Ràng buộc quan trọng nhất là Access Control: Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'` (FR-12 & SEC-03). Ánh xạ bảo mật BFLA và SQLi parameter.

### Bước 2: Phân loại Yêu cầu
- Đối với mỗi API, phân định minh bạch giữa 3 nhóm thông tin:
  1. **Yêu cầu tường minh (Explicit Requirements):** Ghi rõ trực tiếp trong tài liệu SRS.
  2. **Giả định kiểm thử (Testing Assumptions):** Các quy tắc suy diễn hợp lý (ví dụ: email case-insensitive, không chấp nhận địa chỉ chỉ chứa dấu cách trắng).
  3. **Điểm chưa xác định (Unknowns):** Các yếu tố độ trễ mạng có thể tác động tới kiểm thử lockout.

### Bước 3: Thiết lập Ma trận Chiến lược Kiểm thử
- Xây dựng ma trận 5 kỹ thuật kiểm thử cốt lõi cho từng API:
  1. Phân vùng tương đương (Domain Partitions)
  2. Phân tích giá trị biên (Boundary Value Analysis)
  3. Kiểm thử chuyển đổi trạng thái (State Transitions)
  4. Kiểm thử bảo mật (Security Testing SEC-01 -> SEC-07)
  5. Kiểm định schema dữ liệu (Schema Validation)
- Xác định mục tiêu số lượng: $\ge 35$ AI test cases, 100% audit, $\ge 5$ human extension cases (Tổng $\ge 40$ cases / API, toàn suite $\ge 120$ cases).

---

## 2. Thẩm định của Con người (Human Review & Action)
- Sinh viên xem xét tài liệu `api_testing_strategy.md`, xác nhận việc phân chia ranh giới giữa yêu cầu tường minh và giả định kiểm thử là hoàn toàn chính xác và khoa học.
- Chuẩn bị tiến hành Phase 3 cho API 1 (FR-02 Login).
