# Nhật Ký AI Audit - Phiên 005: Pipeline Kiểm Thử API 3 (FR-14 Category CRUD) (Phase 5)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T13:28 -> 2026-09-01T13:38 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Thực hiện trọn vẹn quy trình kiểm thử 15 bước cho toàn bộ 4 phương thức của API 3 (`GET`, `POST`, `PUT`, `DELETE /api/categories`), thẩm định test cases, mở rộng ca kiểm thử bảo mật phân quyền Admin và thực thi Newman.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 5 cho API 3: FR-14 Quản lý Danh mục (CRUD /api/categories). Đảm bảo kiểm thử đủ 4 phương thức GET/POST/PUT/DELETE, kiểm tra chặt chẽ phân quyền Admin và toàn vẹn cơ sở dữ liệu."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- AI sinh ra 38 ca kiểm thử sơ bộ (TC-C01 $\rightarrow$ TC-C38) bao phủ các tham số cơ bản của 4 endpoint.
- Tuy nhiên các ca kiểm thử ban đầu của AI chưa chú trọng đến việc người dùng thông thường có thể gọi trộm API của Admin và chưa kiểm tra ràng buộc khóa ngoại của CSDL.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Người dùng và quy trình kiểm toán đã trực tiếp chỉ đạo hiệu chỉnh qua **5 khúc sửa chuyên sâu**:

### Khúc Sửa 1: Thiết kế Kịch bản Tấn công Phân quyền Broken Function Level Authorization (BFLA - SEC-03)
- **Yêu cầu phản biện:** Theo FR-12 và SEC-03, chỉ tài khoản có `role === 'admin'` mới được thêm/sửa/xóa danh mục. AI ban đầu chỉ test với quyền Admin.
- **Hành động hiệu chỉnh của AI:**
  - Thiết kế các ca kiểm thử bảo mật nâng cao: Sử dụng token của người dùng thông thường (`userToken`) để gửi request `POST /api/categories`, `PUT /api/categories/:id`, và `DELETE /api/categories/:id`.
  - Kết quả kiểm thử thực tế: Server trả về HTTP 200 OK cho cả 3 thao tác $\rightarrow$ Xác nhận lỗ hổng bảo mật nghiêm trọng **BUG-10 (BFLA Access Control Bypass)** tại dòng 249, 257, 269 của `server.js` do chỉ dùng `authenticateToken` mà thiếu `req.user.role === 'admin'`.

### Khúc Sửa 2: Kiểm thử Vi phạm Toàn vẹn Dữ liệu Quan hệ (Referential Integrity Violation)
- **Yêu cầu phản biện:** Kiểm tra xem hệ thống có bảo vệ tính toàn vẹn giữa bảng `categories` và bảng `products` hay không.
- **Hành động hiệu chỉnh của AI:**
  - Thiết kế ca kiểm thử **TC-EXT-19**: Gửi lệnh `DELETE /api/categories/1` (Xóa danh mục "Điện thoại" đang chứa các sản phẩm iPhone, Samsung trong bảng products).
  - Kết quả thực tế: Server xóa thành công danh mục 1, bỏ lại các sản phẩm trỏ vào một `category_id` không còn tồn tại $\rightarrow$ Xác nhận lỗi **BUG-13 (Referential Integrity Violation)** gây mồ côi dữ liệu (Orphaned Records).

### Khúc Sửa 3: Kiểm tra Tính Chuẩn hóa RESTful đối với Tài nguyên Không Tồn Tại
- **Yêu cầu phản biện:** Kiểm tra phản ứng của hệ thống khi cập nhật hoặc xóa tài nguyên với ID giả lập không có trong CSDL.
- **Hành động hiệu chỉnh của AI:**
  - Thiết kế ca kiểm thử `PUT /api/categories/999999` và `DELETE /api/categories/999999`.
  - Kết quả thực tế: Server vẫn trả về HTTP 200 OK $\rightarrow$ Xác nhận lỗi **BUG-12 (RESTful Semantic Violation)** tại dòng 263 và 274 của `server.js` do callback `db.run` không kiểm tra `this.changes === 0`.

### Khúc Sửa 4: Kiểm tra Độ Hợp Lệ Dữ liệu Tên Danh mục (Input Validation)
- **Yêu cầu phản biện:** Kiểm thử khả năng chịu lỗi của API khi gửi tên danh mục rỗng, khoảng trắng hoặc sai định dạng.
- **Hành động hiệu chỉnh của AI:**
  - Thiết kế các ca kiểm thử gửi `name: ""`, `name: null`, `name: "   "`, body `{}` và `name: 12345`.
  - Kết quả thực tế: Server vẫn tạo danh mục rỗng và lưu vào SQLite $\rightarrow$ Xác nhận lỗi **BUG-11 (Missing Input Validation)** tại dòng 251 của `server.js`.

### Khúc Sửa 5: Thiết lập Vòng đời CRUD Liên Hoàn Tự Động (FSM Dynamic Lifecycle)
- **Yêu cầu kỹ thuật:** Cần kiểm tra một vòng đời trọn vẹn của đối tượng danh mục trong môi trường Postman.
- **Hành động hiệu chỉnh của AI:**
  - Cấu hình chuỗi test liên hoàn: `POST /api/categories` trích xuất `createdId` lưu vào biến môi trường `tempCatId` $\rightarrow$ `GET /api/categories` xác nhận có mặt $\rightarrow$ `PUT /api/categories/{{tempCatId}}` đổi tên $\rightarrow$ `DELETE /api/categories/{{tempCatId}}` xóa sạch dữ liệu rác để không làm bẩn CSDL.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.3 (Analyse) & G9.4 (Collaborate)** — Khám phá ra 4 lỗi hệ thống từ mức độ nghiêm trọng đến trung bình, bao gồm cả lỗ hổng OWASP API Top 10 (BFLA) và toàn vẹn cơ sở dữ liệu quan hệ.
