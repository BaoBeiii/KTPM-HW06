---
title: "[BUG][Major][FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công"
labels: ["bug","backend","state-management","p2-major"]
assignees: ["BaoBeiii"]
---

# [BUG][Major][FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** `BUG-06`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST /api/checkout`
- **Mức độ nghiêm trọng (Severity):** `Major`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
Đặc tả FR-08 quy định rõ: 'Sau khi thanh toán thành công, giỏ hàng được làm rỗng'. Tuy nhiên, sau khi gọi POST /api/checkout thành công, giỏ hàng của người dùng vẫn giữ nguyên toàn bộ sản phẩm cũ.

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Thêm sản phẩm vào giỏ hàng: POST /api/cart.
2. Thực hiện thanh toán: POST /api/checkout -> Nhận 200 OK.
3. Kiểm tra lại giỏ hàng: GET /api/cart.

---

## 4. Kết Quả Thực Tế (Actual Result)
Giỏ hàng vẫn còn nguyên các sản phẩm đã thanh toán.

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
GET /api/cart phải trả về mảng rỗng `[]` sau khi đã đặt hàng thành công.

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** File `eshop-sut/backend/server.js`, dòng 297-309: Trong callback thành công của lệnh `INSERT INTO orders`, backend hoàn toàn thiếu dòng lệnh dọn dẹp giỏ hàng: `userCarts[userId] = [];`.

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
  function (err) {
    if (err) return res.status(500).json({ error: err.message });
+   userCarts[userId] = []; // Dọn dẹp giỏ hàng
    res.json({ message: "Checkout successful", orderId: this.lastID });
  }
```
