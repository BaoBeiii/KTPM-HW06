---
title: "[BUG][Medium][FR-02] Thời gian khóa tài khoản bị cấu hình sai (180 giây thay vì 30 giây)"
labels: ["bug","backend","configuration","p3-medium"]
assignees: ["BaoBeiii"]
---

# [BUG][Medium][FR-02] Thời gian khóa tài khoản bị cấu hình sai (180 giây thay vì 30 giây)

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-02`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/login`
- **Mức độ nghiêm trọng (Severity):** `Medium`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Đặc tả FR-02 quy định: 'Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)'. Tuy nhiên, hệ thống thực tế khóa tài khoản trong 180 giây (3 phút).

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Thực hiện đăng nhập sai để kích hoạt khóa tài khoản.
2. Đợi 31 giây (vượt qua mốc 30 giây theo đặc tả demo).
3. Thử đăng nhập lại bằng mật khẩu đúng -> Vẫn bị từ chối với 403 Forbidden.

---

## 4. Kết Quả Thực Tế (Actual Result)
Tài khoản bị khóa trong 180 giây.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Sau đúng 30 giây, tài khoản phải tự động mở khóa và cho phép đăng nhập lại bình thường.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 57: `lockedUntil = new Date(Date.now() + 180000).toISOString();` (180,000 ms = 180s thay vì 30,000 ms = 30s).

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- lockedUntil = new Date(Date.now() + 180000).toISOString();
+ lockedUntil = new Date(Date.now() + 30000).toISOString();
```
