# Tài Liệu Phân Tích Đặc Tả & Chiến Lược Kiểm Thử 3 API (EShop SUT)

- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo
- **Mã số sinh viên (MSSV):** 23127327
- **Giai đoạn:** Phase 2 – API Specification Analysis & Test Strategy Formulation
- **Căn cứ tài liệu:**
  - `eshop-sut/api_specification.md` (Đặc tả kỹ thuật API EShop)
  - `eshop-sut/README.md` (Đặc tả yêu cầu hệ thống SRS & Yêu cầu bảo mật SEC-01 → SEC-07)
  - `2026.HW06.API Testing_En.md` (Yêu cầu đề bài)

---

## 1. Tổng Quan Lựa Chọn 3 API Đại Diện

| Phân hệ | ID & Tên tính năng | Endpoint chính | HTTP Method | Kỹ thuật kiểm thử trọng tâm |
| :--- | :--- | :--- | :---: | :--- |
| **Pool A** | **FR-02:** Đăng nhập & Khóa tài khoản | `/api/login` | `POST` | Phân vùng email/pass, Máy trạng thái Lockout 30s, SEC-01, SQL Injection |
| **Pool B** | **FR-08:** Đặt hàng (Checkout) | `/api/checkout` | `POST` | Phụ thuộc giỏ hàng (`userCarts`), Giá trị biên `total_amount`, Price Tampering, XSS SEC-04 |
| **Pool C** | **FR-14:** Quản lý Danh mục (CRUD) | `/api/categories`<br>`/api/categories/:id` | `POST`<br>`GET`<br>`PUT`<br>`DELETE` | Vòng đời CRUD, Phân quyền Admin RBAC (SEC-03, FR-12), Validation tên danh mục, SQLi `:id` |

---

## 2. Phân Tích Kỹ Thuật Chi Tiết Từng API

### 2.1. API 1 (Pool A - FR-02): Đăng Nhập & Khóa Tài Khoản (`POST /api/login`)

#### A. Thông số Kỹ thuật
- **Endpoint:** `http://localhost:3000/api/login`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}` (Bắt buộc theo quy chế Anti-Cheat)
- **Request Body Schema:**
  ```json
  {
    "email": "string (email format)",
    "password": "string"
  }
  ```
- **Expected Success Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "string (JWT token format: header.payload.signature)",
    "user": {
      "id": "integer",
      "name": "string",
      "email": "string",
      "role": "string ('user' | 'admin')"
    }
  }
  ```
- **Expected Error Responses:**
  - `400 Bad Request`: Body rỗng, thiếu trường bắt buộc, email sai cú pháp.
  - `401 Unauthorized`: Sai email hoặc mật khẩu (`{"error": "Invalid email or password"}`).
  - `403 Forbidden`: Tài khoản đang bị khóa tạm thời (`{"error": "Tài khoản đã bị khóa..."}`).

#### B. Phân loại Yêu cầu
- **Yêu cầu tường minh (Explicit Requirements):**
  - Nhập Email và Mật khẩu.
  - Mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần sai lên đúng 1 đơn vị.
  - Đăng nhập sai từ 3 lần trở lên liên tiếp: Tài khoản bị tạm khóa 30 giây (môi trường demo).
  - Thông báo lỗi chung, không để lộ chi tiết nguyên nhân (user không tồn tại vs sai mật khẩu).
  - Đăng nhập thành công trả về JWT Token và reset bộ đếm số lần sai về 0, xóa thời gian khóa.
- **Giả định kiểm thử (Testing Assumptions):**
  - Email kiểm tra không phân biệt chữ hoa chữ thường (`case-insensitive`: `Test@eshop.com` tương đương `test@eshop.com`).
  - Mật khẩu phải bảo toàn tính phân biệt hoa thường (`case-sensitive`).
  - Khi tài khoản đang trong trạng thái bị khóa 30s, kể cả nhập đúng mật khẩu vẫn phải bị từ chối với HTTP 403.
  - Khi hết 30s, request tiếp theo với mật khẩu đúng phải thành công và mở khóa tài khoản.
- **Điểm chưa xác định (Unknowns):**
  - Thời gian trễ mạng có thể ảnh hưởng đến kiểm thử lockout chính xác theo từng mili-giây.
- **Ánh xạ Bảo mật:**
  - `SEC-01`: Mật khẩu trong response `user` không được để lộ (không trả về trường `password` dạng plaintext hay hash).
  - `SEC-05`: Ngăn chặn SQL Injection trong trường `email` và `password` (ví dụ: `' OR '1'='1`).

---

### 2.2. API 2 (Pool B - FR-08): Đặt Hàng / Thanh Toán (`POST /api/checkout`)

#### A. Thông số Kỹ thuật
- **Endpoint:** `http://localhost:3000/api/checkout`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer {{userToken}}` (Bắt buộc xác thực)
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body Schema:**
  ```json
  {
    "total_amount": "number (integer >= 0)",
    "shipping_address": "string"
  }
  ```
- **Expected Success Response (200 OK):**
  ```json
  {
    "message": "Checkout successful",
    "orderId": "integer > 0"
  }
  ```
- **Expected Error Responses:**
  - `400 Bad Request`: Giỏ hàng rỗng, số tiền âm, địa chỉ giao hàng rỗng.
  - `401 Unauthorized`: Thiếu header Authorization hoặc Token không hợp lệ.
  - `403 Forbidden`: Token bị giả mạo hoặc hết hạn.

#### B. Phân loại Yêu cầu
- **Yêu cầu tường minh (Explicit Requirements):**
  - Chỉ người dùng đã đăng nhập (có Bearer Token) mới được tiến hành checkout.
  - Backend phải tự động tính toán lại tổng tiền từ giỏ hàng thực tế (`userCarts`), không được tin tưởng hoặc chấp nhận giá trị `total_amount` do client gửi lên nếu không khớp.
  - Sau khi checkout thành công, giỏ hàng của người dùng phải được xóa sạch (`userCarts[userId] = []`).
  - Đơn hàng mới tạo phải có trạng thái ban đầu là `pending`.
- **Giả định kiểm thử (Testing Assumptions):**
  - Thực hiện checkout khi giỏ hàng chưa có sản phẩm nào (giỏ hàng rỗng) phải bị từ chối với lỗi phù hợp (HTTP 400), không thể tạo đơn hàng 0 đồng không sản phẩm.
  - Địa chỉ giao hàng không được phép chỉ chứa khoảng trắng trắng (`"   "`).
- **Chuỗi phụ thuộc dữ liệu (Data Dependency Chaining):**
  - *Tiền điều kiện 1:* `POST /api/login` để lấy `userToken`.
  - *Tiền điều kiện 2:* `POST /api/cart` để nạp ít nhất 1 sản phẩm mẫu vào giỏ hàng.
  - *Thao tác chính:* `POST /api/checkout` với thông tin thanh toán.
  - *Hậu điều kiện 1:* `GET /api/cart` xác minh giỏ hàng đã rỗng.
  - *Hậu điều kiện 2:* `GET /api/orders/my-orders` xác minh đơn hàng mới xuất hiện với `status: 'pending'`.
- **Ánh xạ Bảo mật:**
  - `SEC-02`: Bắt buộc kiểm tra JWT Token hợp lệ.
  - `SEC-04`: Ngăn chặn Stored XSS trong trường `shipping_address` (payload: `<script>alert('XSS')</script>`).
  - `Lỗ hổng nghiệp vụ (Price Tampering)`: Kiểm tra trường hợp client cố tình gửi `total_amount = 1` hoặc âm khi giỏ hàng có giá trị lớn.

---

### 2.3. API 3 (Pool C - FR-14): Quản Lý Danh Mục (Category CRUD)

#### A. Thông số Kỹ thuật
- **Endpoints:**
  - `GET /api/categories` (Lấy danh sách tất cả danh mục)
  - `POST /api/categories` (Tạo danh mục mới)
  - `PUT /api/categories/:id` (Cập nhật tên danh mục theo ID)
  - `DELETE /api/categories/:id` (Xóa danh mục theo ID)
- **Headers:**
  - `Authorization: Bearer {{adminToken}}` (Bắt buộc quyền Admin)
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body Schema (POST / PUT):**
  ```json
  {
    "name": "string (không được để trống)"
  }
  ```
- **Expected Success Responses (200 OK):**
  - `POST`: `{"message": "Category created", "id": 4}`
  - `GET`: `[{"id": 1, "name": "Điện thoại"}, {"id": 2, "name": "Laptop"}, ...]`
  - `PUT`: `{"message": "Category updated"}`
  - `DELETE`: `{"message": "Category deleted"}`
- **Expected Error Responses:**
  - `400 Bad Request`: Tên danh mục rỗng `""` hoặc chỉ chứa khoảng trắng.
  - `401 Unauthorized`: Request không truyền token.
  - `403 Forbidden`: Request truyền token của User thường (`role = 'user'`), không phải Admin.
  - `404 Not Found`: Thao tác PUT/DELETE trên ID danh mục không tồn tại.

#### B. Phân loại Yêu cầu
- **Yêu cầu tường minh (Explicit Requirements):**
  - Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
  - Tất cả các API có tính ảnh hưởng dữ liệu (`POST`, `PUT`, `DELETE /api/categories`) đều phải yêu cầu Token JWT hợp lệ và `role = 'admin'` trong Token (FR-12 & SEC-03).
  - Tên danh mục là bắt buộc, không được để trống (FR-14).
- **Giả định kiểm thử (Testing Assumptions):**
  - Thao tác `GET /api/categories` có thể cho phép truy cập công khai (hoặc yêu cầu xác thực cơ bản) để hiển thị danh mục cho khách hàng mua sắm trên giao diện Web.
  - Không thể xóa danh mục đang có sản phẩm liên kết (kiểm tra Foreign Key constraint behavior).
- **Vòng đời trạng thái (CRUD Lifecycle Flow):**
  - `POST /api/categories` tạo danh mục mới $\rightarrow$ Lưu `createdCatId`.
  - `GET /api/categories` xác minh danh mục mới có mặt trong danh sách.
  - `PUT /api/categories/:id` đổi tên danh mục và xác minh tên đã thay đổi.
  - `DELETE /api/categories/:id` xóa danh mục và xác minh danh mục không còn tồn tại.
- **Ánh xạ Bảo mật:**
  - `SEC-02 & SEC-03`: Kiểm soát quyền truy cập phân quyền RBAC (Broken Function Level Authorization - BFLA). Kiểm thử việc User thường cố tình gửi request quản trị danh mục.
  - `SEC-05`: Ngăn chặn SQL Injection trong URL Path Parameter `:id` (ví dụ: `/api/categories/1 OR 1=1`).
  - `SEC-04`: Ngăn chặn XSS trong trường `name` của danh mục.

---

## 3. Ma Trận Chiến Lược Kiểm Thử Toàn Diện (Test Strategy Matrix)

Mỗi API sẽ được áp dụng đầy đủ 5 kỹ thuật kiểm thử cốt lõi để bảo đảm độ bao phủ sâu rộng:

| Kỹ thuật kiểm thử | API 1: FR-02 Login | API 2: FR-08 Checkout | API 3: FR-14 Category CRUD |
| :--- | :--- | :--- | :--- |
| **1. Domain Partitions** | - Email hợp lệ/sai cú pháp/rỗng/null.<br>- Password đúng/sai/rỗng/unicode. | - `total_amount`: dương, 0, âm, kiểu chuỗi.<br>- `shipping_address`: chuẩn, rỗng, cực dài. | - `name`: chuẩn, rỗng `""`, dấu cách, ký tự đặc biệt, unicode có dấu, >255 ký tự. |
| **2. Boundary Value Analysis** | - Mật khẩu độ dài 7, 8, 9 ký tự.<br>- Email độ dài tối đa 254 ký tự. | - `total_amount`: 0, 1, min-1, số cực lớn $10^9$.<br>- Địa chỉ 1 ký tự, 255 ký tự. | - ID danh mục: 0, 1, số âm, ID cực lớn `999999`.<br>- Tên danh mục 1 ký tự, 255 ký tự, 256 ký tự. |
| **3. State Transitions** | - Chu kỳ đăng nhập sai: 0 $\rightarrow$ 1 $\rightarrow$ 2 $\rightarrow$ 3 lần (Lockout).<br>- Thử đăng nhập trong lúc bị khóa.<br>- Mở khóa sau khi hết thời gian khóa. | - Giỏ rỗng $\rightarrow$ Thêm SP $\rightarrow$ Checkout $\rightarrow$ Giỏ rỗng.<br>- Đơn hàng tạo mới có `status = 'pending'`. | - Vòng đời Category: Non-existent $\rightarrow$ Created $\rightarrow$ Read $\rightarrow$ Updated $\rightarrow$ Deleted $\rightarrow$ 404. |
| **4. Security Testing** | - SEC-01: Không lộ plaintext password.<br>- SEC-05: SQLi (`' OR '1'='1`).<br>- Timing attack cơ bản. | - SEC-02: Bắt buộc Bearer token.<br>- SEC-04: XSS trong địa chỉ giao hàng.<br>- Price Tampering (giá client khác giá giỏ). | - SEC-03: User thường gọi CRUD bị 403.<br>- SEC-05: SQLi trong param `:id`.<br>- Stored XSS trong tên danh mục. |
| **5. Schema Validation** | - Kiểm tra schema JWT token (3 phần).<br>- Schema user object `{id, name, email, role}`. | - Schema phản hồi `{message, orderId}`.<br>- Kiểm tra kiểu dữ liệu `orderId` là number. | - Schema mảng đối tượng danh mục `[{id, name}]`.<br>- Schema thông báo thành công. |

---

## 4. Mục Tiêu Số Lượng & Phân Bổ Ca Kiểm Thử

Tuân thủ nghiêm ngặt mục tiêu của đề bài:
- **Mỗi API:**
  - Ca kiểm thử do AI sinh ra (AI-generated): **$\ge 35$ test cases**.
  - Toàn bộ test cases của AI phải được thẩm định (Human Audit) với nhãn `VALID`, `INVALID`, `INCOMPLETE` kèm lý do.
  - Ca kiểm thử mở rộng do con người bổ sung (Human Extension): **$\ge 5$ test cases**.
  - Tổng số ca kiểm thử thực tế thực thi trên mỗi API: **$\ge 40$ test cases**.
- **Toàn bộ Test Suite (3 APIs):**
  - Tổng số test cases mục tiêu: **$\ge 120$ test cases**.
  - Số liệu thực tế sẽ được thống kê trung thực sau khi hoàn thành chạy Newman ở các Phase tiếp theo.
