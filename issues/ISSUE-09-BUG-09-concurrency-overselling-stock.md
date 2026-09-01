---
title: "[BUG][Major][FR-08] Lỗ hổng Overselling & Tồn kho âm khi kiểm thử tương tranh (Concurrency Race Condition)"
labels: ["bug","concurrency","inventory","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-08] Lỗ hổng Overselling & Tồn kho âm khi kiểm thử tương tranh (Concurrency Race Condition)

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-09`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/checkout`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Khi một sản phẩm chỉ còn số lượng bằng 1 và có 2 người dùng (User 1 và User 2) cùng đưa sản phẩm đó vào giỏ hàng và đồng thời thực hiện thanh toán, hệ thống không có cơ chế khóa tương tranh (Locking) hay Transaction cô lập. Cả 2 người đều thanh toán thành công 200 OK và được cấp 2 orderId riêng biệt, dẫn tới việc bán vượt tồn kho (Overselling) và tồn kho bị giảm về âm.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. User 1 và User 2 cùng thêm 1 sản phẩm cuối cùng vào giỏ hàng.
2. User 1 và User 2 đồng thời gửi request POST /api/checkout.

---

## 4. Kết Quả Thực Tế (Actual Result)
Cả 2 request đều trả về 200 OK, đơn hàng được tạo cho cả 2 người mua món hàng duy nhất.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Chỉ người thanh toán trước được 200 OK; người thứ hai phải nhận 400 Bad Request ('Sản phẩm đã hết hàng / Out of stock'); số lượng tồn kho không được âm.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/database.js` thiếu cột `stock` trong bảng products, và `server.js` dòng 297-309 chỉ `INSERT INTO orders` mà không hề có truy vấn kiểm tra tồn kho bằng cơ chế giao dịch khóa hàng.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ // Bổ sung kiểm tra số lượng tồn kho và atomic decrement transaction trong CSDL
```
