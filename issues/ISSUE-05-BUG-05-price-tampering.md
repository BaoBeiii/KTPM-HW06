---
title: "[BUG][Critical][FR-08] Lỗ hổng Price Tampering nghiêm trọng — Backend tin tưởng giá trị total_amount gửi lên từ Client"
labels: ["bug","security","business-logic","p1-critical"]
assignees: ["BaoBeiii"]
---

# [BUG][Critical][FR-08] Lỗ hổng Price Tampering nghiêm trọng — Backend tin tưởng giá trị total_amount gửi lên từ Client

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-05`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/checkout`
- **Mức độ nghiêm trọng (Severity):** `Critical`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Theo đặc tả nghiệp vụ FR-08, tổng số tiền thanh toán bắt buộc phải được tính toán tự động ở phía backend dựa trên giá niêm yết của các sản phẩm có trong giỏ hàng (`userCarts[userId]`) và mã giảm giá hợp lệ. Tuy nhiên, endpoint POST /api/checkout lại lấy trực tiếp trường `total_amount` do client gửi lên trong request body để lưu vào cơ sở dữ liệu orders mà không hề kiểm tra hay tính toán lại.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Thêm sản phẩm có giá trị 30,000,000 VND vào giỏ hàng.
2. Gửi request POST /api/checkout với body: `{"total_amount": 1000, "shipping_address": "123 Le Loi"}` hoặc `{"total_amount": 0, ...}`.

---

## 4. Kết Quả Thực Tế (Actual Result)
Server trả về 200 OK và tạo đơn hàng với tổng tiền chỉ 1,000 VND (hoặc 0 VND), gây thất thoát tài chính nghiêm trọng.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
Backend phải từ chối đơn hàng sai lệch giá (400 Bad Request) hoặc tự động tính toán lại tổng tiền từ giỏ hàng thực tế.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 297-309: Lấy trực tiếp `const { total_amount, shipping_address } = req.body;` và chèn vào bảng orders.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- const { total_amount, shipping_address } = req.body;
+ const cart = userCarts[userId] || [];
+ // Tính toán lại server-side total từ cơ sở dữ liệu products
```
