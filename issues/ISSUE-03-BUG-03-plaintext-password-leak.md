---
title: "[BUG][Critical][SEC-01] Vi phạm bảo mật nghiêm trọng SEC-01 — Để lộ Plaintext Password trong API Login"
labels: ["bug","security","vulnerability","p1-critical"]
assignees: ["BaoBeiii"]
---

# [BUG][Critical][SEC-01] Vi phạm bảo mật nghiêm trọng SEC-01 — Để lộ Plaintext Password trong API Login

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-03`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/login`
- **Mức độ nghiêm trọng (Severity):** `Critical`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo yêu cầu bảo mật SEC-01 và mục 1.2 đặc tả API, thông tin người dùng trả về chỉ gồm id, name, email, role, tuyệt đối không để lộ mật khẩu. Tuy nhiên, endpoint POST /api/login lại trả về nguyên văn mật khẩu plaintext trong thuộc tính user.password của response body JSON.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Gửi request POST /api/login với body: {"email": "test@eshop.com", "password": "Test1234!"}.
2. Quan sát response body JSON nhận được: trường `user.password` chứa 'Test1234!'.

---

## 4. Kết Quả Thực Tế (Actual Result)
Mật khẩu plaintext của người dùng bị rò rỉ trong JSON response (CWE-200: Exposure of Sensitive Information).

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Mật khẩu phải bị loại bỏ hoàn toàn khỏi đối tượng user trước khi phản hồi về client (`delete safeUser.password`).

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 35 & 52: Truy vấn `SELECT * FROM users` và truyền nguyên vẹn đối tượng `user` vào JSON response mà không loại bỏ trường `password`.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- res.json({ message: "Login successful", token, user });
+ const { password, reset_token, ...safeUser } = user;
+ res.json({ message: "Login successful", token, user: safeUser });
```
