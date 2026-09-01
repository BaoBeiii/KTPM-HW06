---
title: "[BUG][Major][FR-14] Vi phạm Tính Toàn Vẹn Quan Hệ (Referential Integrity) khi Xóa Danh mục Đang Chứa Sản phẩm"
labels: ["bug","database","referential-integrity","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-14] Vi phạm Tính Toàn Vẹn Quan Hệ (Referential Integrity) khi Xóa Danh mục Đang Chứa Sản phẩm

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-13`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `DELETE /api/categories/:id`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Hệ thống cho phép xóa trực tiếp danh mục (ví dụ ID 1 'Điện thoại') trong khi vẫn còn nhiều sản phẩm trong bảng products đang liên kết với danh mục này (category_id = 1). Sau khi xóa, các sản phẩm này vẫn tồn tại nhưng trỏ vào một category_id không còn tồn tại, tạo ra các bản ghi mồ côi (Orphaned Records) trong CSDL.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Gửi request DELETE /api/categories/1.
2. Gửi request GET /api/products kiểm tra các sản phẩm có category_id = 1.

---

## 4. Kết Quả Thực Tế (Actual Result)
Danh mục 1 bị xóa thành công (200 OK), các sản phẩm vẫn trỏ vào category_id = 1 nhưng danh mục đã biến mất.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải từ chối xóa và trả về 400 Bad Request hoặc 409 Conflict ('Không thể xóa danh mục đang có sản phẩm liên kết').

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 269-278: Endpoint không thực hiện truy vấn `SELECT COUNT(*) FROM products WHERE category_id = ?` trước khi xóa.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ db.get("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [req.params.id], (err, row) => {
+   if (row && row.count > 0) return res.status(409).json({ error: "Không thể xóa danh mục đang chứa sản phẩm liên kết" });
+   // Tiếp tục xóa nếu count === 0
+ });
```
