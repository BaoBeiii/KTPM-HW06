# Nhật Ký AI Audit - Phiên 006: Hợp Nhất & Thực Thi Toàn Bộ Bộ Kiểm Thử Newman (Phase 6)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T13:42 -> 2026-09-01T13:48 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Hợp nhất toàn bộ 131 test cases của 3 API thành một collection duy nhất, tái thiết lập CSDL SQLite về trạng thái chuẩn hóa, chạy toàn bộ suite bằng Newman và xuất báo cáo tổng hợp.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 6: Hợp nhất toàn bộ bộ ca kiểm thử của 3 API, chạy Newman trên toàn hệ thống và xuất báo cáo tổng kết chi tiết."*

### Phản hồi & Thực thi Ban đầu của AI (Initial AI Response):
- AI cập nhật file `scripts/build_collection.js` để tích hợp cả 3 folder API vào `collections/Postman_Collection.json`.
- Chạy Newman thử nghiệm toàn bộ collection.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Trong quá trình thực thi và tổng hợp, các sự cố và cải tiến đã được giải quyết qua **4 khúc sửa cụ thể**:

### Khúc Sửa 1: Khắc phục Xung đột Khóa Tài khoản Admin trong Lượt Chạy Toàn Cục
- **Vấn đề phát sinh (Issue):** Khi chạy liên tiếp toàn bộ collection từ đầu đến cuối, các test case thử sai đăng nhập (Lockout Tests) của API 1 đã làm tài khoản `admin@eshop.com` bị khóa, khiến cho API 3 ở phía sau không thể lấy token Admin và bị fail hàng loạt.
- **Hành động hiệu chỉnh của AI:** Tách biệt tài khoản kiểm thử: Chuyển các test case thử sai của API 1 sang email riêng `lockout_dummy@eshop.com`, đảm bảo tài khoản Admin luôn ở trạng thái sẵn sàng trong suốt quá trình chạy.

### Khúc Sửa 2: Tái Thiết Lập Cơ Sở Dữ Liệu SQLite (Database Reseeding)
- **Yêu cầu kỹ thuật:** Đảm bảo tính lặp lại (Idempotency) và độ tin cậy tuyệt đối của kết quả kiểm thử.
- **Hành động hiệu chỉnh của AI:** Chạy script `node eshop-sut/backend/database.js` để dọn dẹp các đơn hàng và danh mục tạm thời từ các lượt chạy trước, khôi phục 5 sản phẩm và 4 người dùng mẫu ban đầu.

### Khúc Sửa 3: Xuất Báo Cáo Newman HTML Extra Toàn Bộ Hệ Thống (Consolidated Report)
- **Hành động thực thi:** Chạy Newman với cờ HTML Extra Reporter:
  ```bash
  node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json -r cli,htmlextra --reporter-htmlextra-export reports/newman_full_suite.html
  ```
  - Kết xuất tệp báo cáo hoàn chỉnh `reports/newman_full_suite.html` (dung lượng 2.93 MB) ghi lại từng request, response và assertion.

### Khúc Sửa 4: Xây dựng Bảng Ma trận Thống kê và Tỷ lệ Đạt Chuẩn
- **Yêu cầu báo cáo:** Xây dựng bảng tóm tắt định lượng đối soát giữa số ca kiểm thử, số assertions pass/fail và danh sách 13 bug đã xác nhận.
- **Hành động hiệu chỉnh của AI:** Tạo tệp `reports/summary.md` chứa bảng phân tích số liệu chi tiết cho từng API, chứng minh 100% các assertion thất bại đều ánh xạ 1-1 với các bug thực tế của SUT.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.2 (Apply) & G9.3 (Analyse)** — Vận hành công cụ kiểm thử tự động ở quy mô toàn diện, phát hiện và xử lý triệt để các xung đột trạng thái dữ liệu giữa các phân hệ.
