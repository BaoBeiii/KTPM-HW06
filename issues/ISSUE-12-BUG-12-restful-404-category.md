---
title: "[BUG][Medium][FR-14] Vi phạm Chuẩn RESTful — Endpoint PUT và DELETE luôn trả về 200 OK khi ID Danh mục không tồn tại"
labels: ["bug","backend","restful-standards","p3-medium"]
assignees: ["BaoBeiii"]
---

# [BUG][Medium][FR-14] Vi phạm Chuẩn RESTful — Endpoint PUT và DELETE luôn trả về 200 OK khi ID Danh mục không tồn tại

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-12`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `PUT /api/categories/:id, DELETE /api/categories/:id`
- **Mức độ nghiêm trọng (Severity):** `Medium`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Khi client gửi request cập nhật hoặc xóa một danh mục với ID không hề tồn tại trong cơ sở dữ liệu (ví dụ: id = 999999), server vẫn trả về HTTP 200 OK với thông báo 'Category updated' hoặc 'Category deleted'. Điều này vi phạm nguyên tắc thiết kế RESTful API.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Gửi request DELETE /api/categories/999999 với token hợp lệ.
2. Gửi request PUT /api/categories/999999 với `{"name": "Non-existent"}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK cho cả 2 thao tác trên ID không tồn tại.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải trả về 404 Not Found kèm thông báo 'Danh mục không tồn tại'.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 263, 274: Trong callback của `db.run`, mã nguồn không kiểm tra thuộc tính `this.changes`. Khi `this.changes === 0`, server vẫn mặc định gửi `res.json(...)` thay vì trả về 404.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
  function (err) {
    if (err) return res.status(500).json({ error: err.message });
+   if (this.changes === 0) return res.status(404).json({ error: "Danh mục không tồn tại" });
    res.json({ message: "Category deleted" });
  }
```
