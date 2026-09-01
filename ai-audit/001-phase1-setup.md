# Nhật Ký AI Audit - Phiên 001: Thiết Lập Môi Trường SUT & Postman Foundation (Phase 1)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T11:53 -> 2026-09-01T11:56 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Khởi động backend SUT EShop trên cổng 3000, thiết lập Newman & HTMLEXTRA reporter, cấu hình Postman Collection & Environment với Pre-request Script tự động gán header `X-Student-Id: 23127327`, và thực thi kiểm thử kết nối.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 1: Thiết lập môi trường chạy SUT, cấu hình Postman collection/environment có header X-Student-Id và chạy thử kết nối."*

### Phản hồi & Thực thi Ban đầu của AI (Initial AI Response):
- Khảo sát các tệp tin trong thư mục `eshop-sut/backend/` và kiểm tra CSDL SQLite.
- Tạo cấu trúc dự án cơ bản với `package.json` cài đặt Newman.
- Thiết lập tệp Postman Environment và Collection ban đầu.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Trong quá trình thực thi Phase 1, các vấn đề kỹ thuật và yêu cầu chất lượng đã được xử lý qua **4 khúc điều chỉnh cụ thể**:

### Khúc Sửa 1: Xử lý đường dẫn thực thi Node.js trên môi trường Windows Sandbox
- **Vấn đề phát sinh (Issue):** Lệnh gọi `node` mặc định bị giới hạn bởi quyền thực thi sandbox của hệ thống.
- **Yêu cầu & Hành động điều chỉnh:**
  - AI chuyển đổi toàn bộ các lệnh gọi sang đường dẫn tuyệt đối của Node.js: `& 'C:\Program Files\nodejs\node.exe'`.
  - Đảm bảo các tiến trình thực thi mượt mà mà không gặp lỗi thiếu quyền.

### Khúc Sửa 2: Chuyển đổi tiến trình Backend Server sang chế độ Daemon nền
- **Vấn đề phát sinh (Issue):** Chạy `server.js` dạng foreground làm chiếm dụng terminal và chặn việc chạy các lệnh kiểm thử tiếp theo.
- **Yêu cầu & Hành động điều chỉnh:**
  - AI khởi động backend server với cờ daemon chạy ngầm (`IsDaemon: true`).
  - Thiết lập cơ chế kiểm tra tính sẵn sàng (Health Check Polling) bằng cách gửi request đến `GET http://localhost:3000/api/products` trước khi chạy Newman.

### Khúc Sửa 3: Tự động hóa triệt để Anti-Cheat Header qua Pre-request Script
- **Yêu cầu kiểm thử:** Tránh việc phải cấu hình header `X-Student-Id` thủ công trong từng request đơn lẻ (dễ bỏ sót).
- **Hành động điều chỉnh:**
  - Cài đặt Pre-request Script ở cấp độ root Collection (`collections/Postman_Collection.json`):
    ```javascript
    var studentId = pm.environment.get('studentId') || '23127327';
    pm.request.headers.upsert({
        key: 'X-Student-Id',
        value: studentId
    });
    console.log('[Anti-Cheat Evidence] Header X-Student-Id set to: ' + studentId + ' | Target: ' + pm.request.method + ' ' + pm.request.url);
    ```
  - Đảm bảo 100% request phát sinh từ mọi phase đều tự động mang theo mã số sinh viên `23127327`.

### Khúc Sửa 4: Tạo lập bằng chứng minh thực thi cục bộ chống gian lận AI
- **Yêu cầu kiểm thử:** Đề bài HW06 yêu cầu bằng chứng thực thi thực tế (Anti-Cheat) không thể tạo giả.
- **Hành động điều chỉnh:**
  - Chạy Newman xuất log ra file `screenshots/console_evidence_student_id.txt` ghi nhận rõ: `Student ID: 23127327`, `Target Host: http://localhost:3000`, `Timestamp`, và log in ra từ Pre-request Script.
  - Xuất báo cáo HTML kiểm tra sức khỏe `reports/healthcheck_report.html`.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.2 (Apply)** — Ứng dụng thành công các công cụ Newman, Node.js runtime và Postman scripting để xây dựng nền tảng kiểm thử tự động vững chắc.
