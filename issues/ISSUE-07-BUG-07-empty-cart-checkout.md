---
title: "[BUG][Major][FR-08] Cho phép tạo đơn hàng khi giỏ hàng rỗng"
labels: ["bug","backend","business-logic","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-08] Cho phép tạo đơn hàng khi giỏ hàng rỗng

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-07`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/checkout`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo quy trình nghiệp vụ mua sắm trực tuyến, người dùng không thể thanh toán đơn hàng khi giỏ hàng chưa có bất kỳ sản phẩm nào. Tuy nhiên, SUT cho phép gọi checkout và tạo đơn hàng thành công ngay cả khi `userCarts[userId]` rỗng hoặc chưa từng được khởi tạo.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Người dùng mới đăng ký, giỏ hàng hoàn toàn rỗng.
2. Gửi request POST /api/checkout với body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK và tạo một đơn hàng rỗng trong CSDL.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Server phải từ chối yêu cầu và trả về 400 Bad Request ('Giỏ hàng rỗng, không thể thanh toán').

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 297-309: Endpoint không kiểm tra giỏ hàng của user hiện tại trước khi tạo bản ghi đơn hàng.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
+ if (!userCarts[userId] || userCarts[userId].length === 0) {
+   return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });
+ }
```
