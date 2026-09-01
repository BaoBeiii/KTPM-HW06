# Nhật Ký AI Audit - Phiên 001: Thiết Lập Môi Trường SUT & Postman Foundation (Phase 1)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T11:53 -> 2026-09-01T11:56 (GMT+7)
- **Mục đích:** Khởi động backend SUT EShop trên cổng 3000, thiết lập thư viện Newman & HTMLEXTRA reporter, cấu hình Postman Collection & Environment với Pre-request Script tự động gán header `X-Student-Id: 23127327`, và thực thi kiểm thử kết nối.

---

## 1. Nội dung Tương tác & Thực thi

### Bước 1: Kiểm tra Môi trường Runtime
- Phát hiện môi trường sandbox cần chạy đường dẫn trực tiếp tới `node.exe` tại `C:\Program Files\nodejs\node.exe` (Node v24.11.0, npm 11.6.1).
- Kiểm tra các dependencies trong `eshop-sut/backend/node_modules` (`express`, `sqlite3`, `jsonwebtoken`, `cors`, `body-parser`) đều đã sẵn sàng.

### Bước 2: Cài đặt Newman & HTMLEXTRA
- Khởi tạo file `package.json` ở root dự án để quản lý cục bộ `newman` (v6.2.2) và `newman-reporter-htmlextra` (v1.23.1).
- Chạy `npm install` để đảm bảo hệ thống có thể chạy kiểm thử tự động độc lập và phục vụ CI/CD GitHub Actions sau này.

### Bước 3: Khởi động Backend SUT (Port 3000)
- Khởi động backend Node.js `node eshop-sut/backend/server.js` dưới dạng daemon background process.
- Gửi HTTP GET request tới `http://localhost:3000/api/products` và nhận phản hồi HTTP 200 OK với danh sách 5 sản phẩm mẫu từ SQLite.

### Bước 4: Thiết lập Postman Foundation & Anti-Cheat Header
- Tạo `collections/Postman_Environment.json` chứa biến `baseUrl`, `studentId` (`23127327`), và thông tin tài khoản mẫu.
- Tạo `collections/Postman_Collection.json` có cấu hình Pre-request Script cấp Collection để tự động inject header:
  ```javascript
  var studentId = pm.environment.get('studentId') || '23127327';
  pm.request.headers.upsert({
      key: 'X-Student-Id',
      value: studentId
  });
  console.log('[Anti-Cheat Evidence] Header X-Student-Id set to: ' + studentId);
  ```
- Tạo test case kiểm tra kết nối `00.1 Health Check & Connectivity`.

### Bước 5: Chạy Thực nghiệm với Newman
- Lệnh thực thi:
  ```bash
  node node_modules/newman/bin/newman.js run collections/Postman_Collection.json -e collections/Postman_Environment.json -r cli,htmlextra --reporter-htmlextra-export reports/healthcheck_report.html
  ```
- Kết quả: 1 request, 3 assertions passed 100%, thời gian phản hồi trung bình 23ms. Header `X-Student-Id: 23127327` được ghi nhận rõ trong log.
- Lưu trữ bằng chứng: `screenshots/console_evidence_student_id.txt` và `reports/healthcheck_report.html`.

---

## 2. Thẩm định của Con người (Human Review & Action)
- Sinh viên kiểm tra log console xác nhận header `X-Student-Id: 23127327` đã được đính kèm đúng chuẩn.
- Xác nhận backend SUT hoạt động ổn định trên `localhost:3000`.
