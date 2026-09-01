# Báo Cáo Lỗi Hệ Thống (Bug Report) — EShop SUT

- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: 23127327)
- **Hệ thống kiểm thử:** EShop Backend API (`http://localhost:3000`)
- **Tài liệu đối chiếu:** `api_specification.md` và `README.md` (SRS)

---

## Danh Sách Lỗi Đã Xác Thực (Verified Genuine Bugs)

### BUG-01: Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1)
- **Mã lỗi:** `BUG-01`
- **API bị ảnh hưởng:** `POST /api/login` (FR-02)
- **Mức độ nghiêm trọng:** `Major`
- **Mô tả:** Theo đặc tả FR-02, sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị và chỉ khóa tài khoản khi đăng nhập sai từ 3 lần trở lên liên tiếp. Tuy nhiên, trong thực tế, ngay sau lần đăng nhập sai thứ 2, tài khoản đã bị khóa ngay lập tức.
- **Nguyên nhân kỹ thuật:** Trong file `server.js` (dòng 54), mã nguồn thực hiện `const newAttempts = user.login_attempts + 2;` thay vì `+ 1`. Do đó, lần 1 đếm thành 2, lần 2 đếm thành 4 ($\ge 3$) dẫn tới khóa tài khoản sớm.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `POST /api/login` với email hợp lệ và mật khẩu sai lần 1 $\rightarrow$ Trả về 401 Unauthorized.
  2. Gửi request `POST /api/login` với mật khẩu sai lần 2 $\rightarrow$ Trả về 401 Unauthorized.
  3. Gửi request `POST /api/login` lần 3 với mật khẩu đúng $\rightarrow$ Bị từ chối với `403 Forbidden` (báo tài khoản đã bị khóa).
- **Kết quả thực tế (Actual Result):** Tài khoản bị khóa chỉ sau 2 lần nhập sai.
- **Kết quả mong đợi (Expected Result):** Phải cho phép người dùng thử sai tối đa 3 lần, lần thứ 4 mới kích hoạt trạng thái khóa.

---

### BUG-02: Thời gian khóa tài khoản bị cấu hình sai (180 giây thay vì 30 giây)
- **Mã lỗi:** `BUG-02`
- **API bị ảnh hưởng:** `POST /api/login` (FR-02)
- **Mức độ nghiêm trọng:** `Medium`
- **Mô tả:** Đặc tả FR-02 quy định: "Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)". Tuy nhiên, hệ thống thực tế khóa tài khoản trong 180 giây (3 phút).
- **Nguyên nhân kỹ thuật:** Trong file `server.js` (dòng 57), mã nguồn tính toán thời gian khóa: `lockedUntil = new Date(Date.now() + 180000).toISOString();` (180000 ms = 180s = 3 phút thay vì 30000 ms = 30s).
- **Các bước tái hiện (Steps to Reproduce):**
  1. Thực hiện đăng nhập sai để kích hoạt khóa tài khoản.
  2. Đợi 31 giây (vượt qua mốc 30 giây theo đặc tả).
  3. Thử đăng nhập lại bằng mật khẩu đúng $\rightarrow$ Vẫn bị từ chối `403 Forbidden`.
- **Kết quả thực tế (Actual Result):** Tài khoản bị khóa trong 180 giây.
- **Kết quả mong đợi (Expected Result):** Sau đúng 30 giây, tài khoản phải tự động mở khóa và cho phép đăng nhập lại.

---

### BUG-03: Vi phạm bảo mật nghiêm trọng SEC-01 — Để lộ Plaintext Password trong API Login
- **Mã lỗi:** `BUG-03`
- **API bị ảnh hưởng:** `POST /api/login` (SEC-01, FR-02)
- **Mức độ nghiêm trọng:** `Critical (Security Vulnerability)`
- **Mô tả:** Theo yêu cầu bảo mật SEC-01 và mục 1.2 đặc tả API, thông tin người dùng trả về chỉ gồm `id`, `name`, `email`, `role`, tuyệt đối không để lộ mật khẩu. Tuy nhiên, endpoint `POST /api/login` lại trả về nguyên văn mật khẩu plaintext trong thuộc tính `user.password` của response body JSON.
- **Nguyên nhân kỹ thuật:** Trong file `server.js` (dòng 35 & 52), truy vấn cơ sở dữ liệu dùng `SELECT * FROM users WHERE email = ?` và trả về trực tiếp đối tượng `user` vào JSON response (`res.json({ message: "Login successful", token, user })`) mà không loại bỏ trường `password`.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `POST /api/login` với body: `{"email": "test@eshop.com", "password": "Test1234!"}`.
  2. Quan sát response body JSON nhận được:
     ```json
     {
       "message": "Login successful",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
       "user": {
         "id": 2,
         "name": "Test User",
         "email": "test@eshop.com",
         "password": "Test1234!",
         "role": "user",
         "login_attempts": 0,
         "locked_until": null,
         ...
       }
     }
     ```
- **Kết quả thực tế (Actual Result):** Mật khẩu plaintext bị trả về công khai cho client.
- **Kết quả mong đợi (Expected Result):** Thuộc tính `password` phải được xóa bỏ khỏi đối tượng `user` trước khi gửi về client (`user.password === undefined`).

---

### BUG-04: Không hỗ trợ đăng nhập với Email viết hoa (Case-Insensitive Email Handling)
- **Mã lỗi:** `BUG-04`
- **API bị ảnh hưởng:** `POST /api/login` (FR-02)
- **Mức độ nghiêm trọng:** `Minor`
- **Mô tả:** Theo tiêu chuẩn RFC internet email, địa chỉ email không phân biệt chữ hoa chữ thường. Người dùng gõ `TEST@ESHOP.COM` hoặc `test@eshop.com` phải được đăng nhập bình thường. Tuy nhiên SUT từ chối với 401 Unauthorized.
- **Nguyên nhân kỹ thuật:** SQLite thực hiện so khớp chuỗi phân biệt hoa thường với toán tử `= ?` mặc định, không sử dụng `LOWER(email) = LOWER(?)` hoặc `COLLATE NOCASE`.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `POST /api/login` với body: `{"email": "TEST@ESHOP.COM", "password": "Test1234!"}`.
- **Kết quả thực tế (Actual Result):** Trả về `401 Unauthorized` (`Invalid email or password`).
- **Kết quả mong đợi (Expected Result):** Đăng nhập thành công `200 OK`.

---

### BUG-05: Lỗ hổng Price Tampering nghiêm trọng — Backend không tự tính toán lại tổng tiền giỏ hàng
- **Mã lỗi:** `BUG-05`
- **API bị ảnh hưởng:** `POST /api/checkout` (FR-08)
- **Mức độ nghiêm trọng:** `Critical (Business Logic Flaw)`
- **Mô tả:** Theo đặc tả FR-08: "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount do client gửi lên". Tuy nhiên, endpoint `/api/checkout` nhận trực tiếp giá trị `total_amount` từ request body và ghi thẳng vào database, cho phép khách hàng mua sản phẩm trị giá hàng chục triệu đồng với giá 1,000đ hoặc 0đ.
- **Nguyên nhân kỹ thuật:** Trong file `server.js` (dòng 299 & 302), mã nguồn trích xuất `const { total_amount, shipping_address } = req.body;` và thực thi câu lệnh SQL: `INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)`, trong đó `total_amount` được lấy trực tiếp từ client mà không hề duyệt qua `userCarts[userId]` để tính tổng tiền theo giá sản phẩm thực tế.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Thêm 1 sản phẩm đắt tiền (ví dụ: iPhone 15 Pro Max giá 30,000,000đ) vào giỏ qua `POST /api/cart`.
  2. Gửi request `POST /api/checkout` với body bị sửa đổi: `{"total_amount": 1000, "shipping_address": "123 Le Loi"}`.
- **Kết quả thực tế (Actual Result):** Hệ thống trả về `200 OK` (`{"message": "Checkout successful", "orderId": X}`) và tạo đơn hàng với tổng tiền chỉ 1,000đ.
- **Kết quả mong đợi (Expected Result):** Backend phải tự tính lại tổng tiền là 30,000,000đ, hoặc từ chối request nếu số tiền client gửi không khớp với tính toán nội bộ.

---

### BUG-06: Giỏ hàng không được làm rỗng sau khi thanh toán thành công
- **Mã lỗi:** `BUG-06`
- **API bị ảnh hưởng:** `POST /api/checkout` (FR-08)
- **Mức độ nghiêm trọng:** `Major (State Management Bug)`
- **Mô tả:** Theo đặc tả FR-08: "Sau thanh toán thành công, giỏ hàng được xóa". Tuy nhiên, trong thực tế sau khi tạo đơn hàng thành công, giỏ hàng của người dùng vẫn giữ nguyên toàn bộ sản phẩm cũ.
- **Nguyên nhân kỹ thuật:** Trong hàm xử lý `app.post("/api/checkout", ...)` tại `server.js` (dòng 297-309), hoàn toàn không có dòng lệnh nào thực hiện reset hoặc xóa `userCarts[userId] = []`.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Thêm sản phẩm vào giỏ bằng `POST /api/cart`.
  2. Gọi `POST /api/checkout` $\rightarrow$ Nhận phản hồi 200 OK Checkout successful.
  3. Gọi `GET /api/cart` để kiểm tra trạng thái giỏ hàng.
- **Kết quả thực tế (Actual Result):** `GET /api/cart` vẫn trả về danh sách các sản phẩm cũ vừa mua.
- **Kết quả mong đợi (Expected Result):** `GET /api/cart` phải trả về mảng rỗng `[]` (hoặc `{cart: []}`).

---

### BUG-07: Cho phép đặt hàng thành công khi giỏ hàng rỗng
- **Mã lỗi:** `BUG-07`
- **API bị ảnh hưởng:** `POST /api/checkout` (FR-08)
- **Mức độ nghiêm trọng:** `Major (Business Logic Flaw)`
- **Mô tả:** Người dùng chưa thêm bất kỳ sản phẩm nào vào giỏ (`userCarts` rỗng) vẫn có thể gửi request `POST /api/checkout` và tạo đơn hàng thành công.
- **Nguyên nhân kỹ thuật:** Endpoint `/api/checkout` không kiểm tra độ dài mảng `userCarts[userId]` trước khi thực hiện câu lệnh INSERT INTO orders.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Đăng nhập tài khoản mới chưa có giỏ hàng.
  2. Gửi request `POST /api/checkout` với body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}`.
- **Kết quả thực tế (Actual Result):** Hệ thống trả về `200 OK` và tạo đơn hàng rỗng không sản phẩm trong database.
- **Kết quả mong đợi (Expected Result):** Hệ thống phải trả về `400 Bad Request` với thông báo lỗi giỏ hàng rỗng.

---

### BUG-08: Thiếu hoàn toàn Validation dữ liệu đầu vào trên Endpoint Checkout
- **Mã lỗi:** `BUG-08`
- **API bị ảnh hưởng:** `POST /api/checkout` (FR-08)
- **Mức độ nghiêm trọng:** `Major (Input Validation Flaw)`
- **Mô tả:** Endpoint `/api/checkout` không thực hiện bất kỳ kiểm tra hợp lệ nào đối với các trường trong request body. Hệ thống chấp nhận:
  - `total_amount` âm (ví dụ: `-50000`), bằng 0, null, boolean, hoặc chuỗi chữ.
  - `shipping_address` là chuỗi rỗng `""`, null, toàn khoảng trắng, hoặc kiểu số.
  - Body rỗng `{}`.
- **Nguyên nhân kỹ thuật:** Mã nguồn không có middleware hoặc điều kiện `if (!total_amount || !shipping_address)` để validate dữ liệu đầu vào.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `POST /api/checkout` với `{"total_amount": -50000, "shipping_address": ""}`.
- **Kết quả thực tế (Actual Result):** Trả về `200 OK` và lưu giá trị âm cùng địa chỉ rỗng vào CSDL.
- **Kết quả mong đợi (Expected Result):** Trả về `400 Bad Request` với thông báo lỗi cụ thể cho từng trường không hợp lệ.

