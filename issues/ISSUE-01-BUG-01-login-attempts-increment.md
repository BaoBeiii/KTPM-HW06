---
title: "[BUG][Major][FR-02] Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1)"
labels: ["bug","backend","authentication","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-02] Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1)

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-01`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/login`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo đặc tả FR-02, sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị và chỉ khóa tài khoản khi đăng nhập sai từ 3 lần trở lên liên tiếp. Tuy nhiên, trong thực tế, ngay sau lần đăng nhập sai thứ 2, tài khoản đã bị khóa ngay lập tức.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Gửi request POST /api/login với email hợp lệ và mật khẩu sai lần 1 -> 401 Unauthorized.
2. Gửi request POST /api/login với mật khẩu sai lần 2 -> 401 Unauthorized.
3. Gửi request POST /api/login lần 3 với mật khẩu đúng -> Bị từ chối với 403 Forbidden (báo tài khoản đã bị khóa).

---

## 4. Kết Quả Thực Tế (Actual Result)
Tài khoản bị khóa chỉ sau 2 lần nhập sai vì bộ đếm nhảy từ 0 -> 2 -> 4 (>= 3).

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Phải cho phép người dùng thử sai tối đa 3 lần, lần thứ 4 mới kích hoạt trạng thái khóa.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 54: `const newAttempts = user.login_attempts + 2;` thay vì `+ 1`.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- const newAttempts = user.login_attempts + 2;
+ const newAttempts = (user.login_attempts || 0) + 1;
```
