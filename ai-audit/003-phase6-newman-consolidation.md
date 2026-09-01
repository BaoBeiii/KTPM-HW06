# Nhật Ký AI Audit - Phiên 006: Hợp Nhất & Thực Thi Toàn Bộ Bộ Kiểm Thử Newman (Phase 6)

- **Môn học:** Kiểm thử phần mềm (HW06 - API Testing)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Phân hệ thực hiện:** Hợp nhất toàn bộ Test Suite & Thực thi Newman CLI
- **Kho lưu trữ:** [https://github.com/BaoBeiii/KTPM-HW06](https://github.com/BaoBeiii/KTPM-HW06)

---

## Danh Sách Các Tương Tác Chi Tiết (Detailed Interaction Logs)

### 1. Tương tác 6.1: Yêu Cầu Khởi Tạo Hợp Nhất & Chạy Toàn Bộ Test Suite
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:42:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 6: Hợp nhất toàn bộ bộ ca kiểm thử của 3 API, chạy Newman trên toàn hệ thống và xuất báo cáo tổng kết chi tiết."*
- **Tóm tắt Output của AI:**
  - AI cập nhật mã nguồn `scripts/build_collection.js` để tích hợp toàn bộ các thư mục kiểm thử: Health Check, Pool A (FR-02 Login), Pool B (FR-08 Checkout), Pool C (FR-14 Categories).
  - Tự động sinh tệp `collections/Postman_Collection.json` chứa 142 requests và 179 assertions.

---

### 2. Tương tác 6.2 (Khúc sửa 1): Khắc Phục Xung Đột Tài Khoản Admin Khi Chạy Liên Hoàn
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:43:45 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra tại sao khi chạy toàn bộ test suite thì các test case của API 3 lại bị fail quyền Admin?"*
- **Tóm tắt Output của AI:**
  - Phân tích nguyên nhân: Các ca kiểm thử thử sai mật khẩu liên tiếp (Lockout Tests) của API 1 đã khóa tài khoản `admin@eshop.com` trong 180 giây (BUG-02), khiến API 3 không thể đăng nhập lấy adminToken.
  - Hành động sửa chữa: Chuyển các test case TC-A10, TC-A11, TC-A30, TC-A31 sang email dummy riêng biệt (`lockout_dummy@eshop.com`), bảo vệ tài khoản Admin luôn mở trong toàn bộ vòng đời kiểm thử.

---

### 3. Tương tác 6.3 (Khúc sửa 2): Tái Lập Cơ Sở Dữ Liệu SQLite Về Trạng Thái Gốc
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:45:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Tái lập cơ sở dữ liệu SQLite về trạng thái ban đầu trước khi chạy Newman toàn cục để đảm bảo kết quả chính xác."*
- **Tóm tắt Output của AI:**
  - Thực thi lệnh `node eshop-sut/backend/database.js`.
  - Tái tạo bảng, dọn dẹp các đơn hàng tạo thử và danh mục rác, nạp lại 5 sản phẩm chuẩn và 4 tài khoản người dùng nguyên bản.

---

### 4. Tương tác 6.4 (Khúc sửa 3): Thực Thi Newman & Kết Xuất Báo Cáo HTML Extra
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:46:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Chạy Newman toàn bộ collection và kết xuất báo cáo HTML Extra chi tiết."*
- **Tóm tắt Output của AI:**
  - Chạy lệnh: `node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json -r cli,htmlextra --reporter-htmlextra-export reports/newman_full_suite.html`.
  - Kết xuất tệp báo cáo `reports/newman_full_suite.html` (2.93 MB) ghi nhận 142 requests, 179 assertions (139 passed, 40 failed).

---

### 5. Tương tác 6.5 (Khúc sửa 4): Xây Dựng Bảng Ma Trận Tổng Hợp & Đối Soát 13 Lỗi
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:48:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Lập bảng ma trận số liệu định lượng chi tiết cho từng API và chứng minh các assertion fail đều tương ứng với bug thật."*
- **Tóm tắt Output của AI:**
  - Soạn thảo tệp `reports/summary.md` lập bảng phân tích định lượng chi tiết theo từng API.
  - Chứng minh tỷ lệ 40 assertions thất bại đều bắt nguồn từ 13 lỗi thực tế của SUT (BUG-01 $\rightarrow$ BUG-13).

---

## Đánh Giá Năng Lực Bloom-AI
- **Mức độ đạt được:** **G9.2 (Apply) & G9.3 (Analyse)**
- **Kết luận:** Quá trình tự động hóa kiểm thử quy mô toàn diện đã vận hành trơn tru, phát hiện và xử lý triệt để các xung đột trạng thái dữ liệu ngầm.
