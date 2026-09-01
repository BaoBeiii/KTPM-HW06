---
title: "[BUG][Medium][FR-02] Email trong API Login phân biệt hoa/thường sai chuẩn RFC (Case-sensitive email login)"
labels: ["bug","backend","rfc-compliance","p3-medium"]
assignees: ["BaoBeiii"]
---

# [BUG][Medium][FR-02] Email trong API Login phân biệt hoa/thường sai chuẩn RFC (Case-sensitive email login)

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-04`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/login`
- **Mức độ nghiêm trọng (Severity):** `Medium`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo chuẩn RFC 5321 và thực tiễn thiết kế hệ thống xác thực hiện đại, địa chỉ email không phân biệt chữ hoa chữ thường (case-insensitive). Người dùng đăng ký 'test@eshop.com' phải có thể đăng nhập bằng 'TEST@ESHOP.COM'. Tuy nhiên SUT phân biệt hoa thường chặt chẽ và từ chối đăng nhập.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Tài khoản đăng ký trong hệ thống: `test@eshop.com`.
2. Gửi request POST /api/login với `{"email": "TEST@ESHOP.COM", "password": "Test1234!"}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 401 Unauthorized ('Tài khoản không tồn tại').

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Đăng nhập thành công với 200 OK vì email không phân biệt chữ hoa chữ thường.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 35: Truy vấn `SELECT * FROM users WHERE email = ?` so khớp trực tiếp chuỗi chữ hoa mà không chuẩn hóa `LOWER(email) = LOWER(?)`.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- db.get("SELECT * FROM users WHERE email = ?", [email], ...)
+ db.get("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email], ...)
```
