---
title: "[BUG][Major][FR-08] Thiếu hoàn toàn Validation dữ liệu đầu vào trên Endpoint Checkout"
labels: ["bug","backend","input-validation","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-08] Thiếu hoàn toàn Validation dữ liệu đầu vào trên Endpoint Checkout

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-08`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/checkout`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Endpoint /api/checkout không thực hiện bất kỳ kiểm tra hợp lệ nào đối với các trường trong request body. Hệ thống chấp nhận: `total_amount` âm (-50,000), bằng 0, null, boolean, chuỗi chữ; `shipping_address` rỗng, null, khoảng trắng, kiểu số; và body rỗng `{}`.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Gửi request POST /api/checkout với `{"total_amount": -50000, "shipping_address": ""}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK và ghi nhận đơn hàng giá tiền âm với địa chỉ giao hàng rỗng.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải trả về 400 Bad Request với thông báo lỗi rõ ràng.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 297-309: Không có middleware kiểm tra tính hợp lệ của tham số.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ if (typeof total_amount !== 'number' || total_amount <= 0) {
+   return res.status(400).json({ error: "total_amount phải là số nguyên dương" });
+ }
+ if (!shipping_address || typeof shipping_address !== 'string' || !shipping_address.trim()) {
+   return res.status(400).json({ error: "shipping_address không được để trống" });
+ }
```
