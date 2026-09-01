---
title: "[BUG][Critical][FR-14][SEC-03] Lỗ hổng Phân quyền Broken Function Level Authorization (BFLA) trên các Endpoint Quản lý Danh mục"
labels: ["bug","security","bfla","owasp-top-10","p1-critical"]
assignees: ["BaoBeiii"]
---

# [BUG][Critical][FR-14][SEC-03] Lỗ hổng Phân quyền Broken Function Level Authorization (BFLA) trên các Endpoint Quản lý Danh mục

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-10`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST/PUT/DELETE /api/categories`
- **Mức độ nghiêm trọng (Severity):** `Critical`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo đặc tả phân hệ Admin (FR-12 & SEC-03), các tác vụ thêm, sửa, xóa danh mục chỉ được phép thực hiện bởi tài khoản Quản trị viên (role === 'admin'). Tuy nhiên, trên hệ thống SUT, bất kỳ người dùng thông thường nào (role: 'user') chỉ cần có token hợp lệ đều có thể tạo mới, cập nhật tên hoặc xóa sạch các danh mục của hệ thống.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Đăng nhập tài khoản người dùng thường: test@eshop.com.
2. Gửi request POST /api/categories với Authorization: Bearer <userToken> và body `{"name": "Hacked Category"}`.
3. Gửi request DELETE /api/categories/3 với Authorization: Bearer <userToken>.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK cho cả thao tác tạo và xóa danh mục bởi người dùng thông thường.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải từ chối truy cập và trả về HTTP 403 Forbidden ('Yêu cầu quyền Quản trị viên').

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 249, 257, 269: Chỉ sử dụng middleware `authenticateToken` để kiểm tra JWT hợp lệ mà hoàn toàn thiếu bước kiểm tra `req.user.role === 'admin'`.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ const requireAdmin = (req, res, next) => {
+   if (req.user && req.user.role === 'admin') return next();
+   return res.status(403).json({ error: "Yêu cầu quyền Quản trị viên" });
+ };
- app.post("/api/categories", authenticateToken, ...)
+ app.post("/api/categories", authenticateToken, requireAdmin, ...)
```
