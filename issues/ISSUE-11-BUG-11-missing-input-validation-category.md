---
title: "[BUG][Major][FR-14] Thiếu hoàn toàn Validation Dữ liệu Tên Danh mục trên POST và PUT /api/categories"
labels: ["bug","backend","input-validation","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-14] Thiếu hoàn toàn Validation Dữ liệu Tên Danh mục trên POST và PUT /api/categories

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-11`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/categories, PUT /api/categories/:id`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Hệ thống không kiểm tra tính hợp lệ của trường `name` khi tạo hoặc cập nhật danh mục: chấp nhận chuỗi rỗng "", null, khoảng trắng "   ", body rỗng {}, hoặc kiểu số 12345.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Đăng nhập tài khoản Admin.
2. Gửi request POST /api/categories với body `{"name": ""}` hoặc `{"name": null}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK và lưu một dòng có tên rỗng/null vào CSDL.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải trả về 400 Bad Request với thông báo 'Tên danh mục không được để trống'.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 249-267: Biến `{ name } = req.body` được truyền trực tiếp vào câu lệnh SQL INSERT/UPDATE mà không qua bất kỳ câu lệnh validate nào.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ if (!name || typeof name !== 'string' || !name.trim()) {
+   return res.status(400).json({ error: "Tên danh mục không được để trống" });
+ }
```
