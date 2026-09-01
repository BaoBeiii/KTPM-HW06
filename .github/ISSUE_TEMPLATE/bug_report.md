---
name: "Báo cáo lỗi phần mềm (Bug Report)"
about: "Tạo báo cáo lỗi hệ thống chuẩn hóa cho dự án kiểm thử phần mềm eShop API (HW06)"
title: "[BUG][<SEVERITY>][<API>] <Mô tả ngắn gọn về lỗi>"
labels: ["bug", "triage"]
assignees: ["BaoBeiii"]
---

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** BUG-XX
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **API bị ảnh hưởng:** `POST/GET/PUT/DELETE /api/...`
- **Mức độ nghiêm trọng (Severity):** Critical / Major / Medium / Low
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1
- **Liên kết Test Case Postman:** `TC-XXX` trong collection `collections/Postman_Collection.json`

---

## 2. Mô Tả Lỗi (Bug Description)
<!-- Mô tả chi tiết hành vi sai lệch của hệ thống so với đặc tả yêu cầu -->

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Bước 1: ...
2. Bước 2: ...
3. Gửi HTTP Request:
```bash
curl -X POST http://localhost:3000/api/... \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

---

## 4. Kết Quả Thực Tế (Actual Result)
- **HTTP Status Code:** `200 OK` (hoặc mã lỗi sai)
- **Response Body:**
```json
{
  "error": "..."
}
```

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
- **HTTP Status Code:** `400 Bad Request` / `401 Unauthorized` / `403 Forbidden` / `404 Not Found`
- **Hành vi chuẩn:** ...

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **File mã nguồn bị lỗi:** `eshop-sut/backend/server.js` (hoặc `database.js`)
- **Dòng mã nguồn:** Dòng XXX $\rightarrow$ YYY
- **Nguyên nhân cốt lõi:** ...

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
```diff
- // Đoạn mã cũ bị lỗi
+ // Đoạn mã sửa chữa đề xuất
```
