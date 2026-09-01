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

---

### BUG-09: Lỗ hổng Overselling & Tồn kho âm khi kiểm thử tương tranh (Concurrency Race Condition)
- **Mã lỗi:** `BUG-09`
- **API bị ảnh hưởng:** `POST /api/checkout` (FR-08)
- **Mức độ nghiêm trọng:** `Major (Concurrency / Inventory Control Flaw)`
- **Mô tả:** Khi một sản phẩm chỉ còn số lượng bằng 1 và có 2 người dùng (`User 1` và `User 2`) cùng đưa sản phẩm đó vào giỏ hàng và đồng thời thực hiện thanh toán (`POST /api/checkout`):
  - Hệ thống không có cơ chế khóa tương tranh (Pessimistic/Optimistic Locking) hoặc Atomic Transaction để trừ tồn kho.
  - Cả 2 người dùng đều thanh toán thành công và nhận được HTTP `200 OK` kèm `orderId` riêng biệt.
  - Hệ thống bán vượt quá số lượng hàng có sẵn (Overselling), khiến cho nếu hệ thống có trừ kho thì số lượng tồn kho sẽ bị âm (`stock = 1 - 2 = -1`), gây thiệt hại nghiêm trọng cho khâu vận hành và fulfillment.
- **Nguyên nhân kỹ thuật:**
  1. Bảng `products` trong `database.js` hoàn toàn không có trường `stock`/`quantity` để quản lý số lượng tồn kho.
  2. Hàm `app.post("/api/checkout", ...)` trong `server.js` (dòng 297-309) chỉ thực hiện đơn thuần `INSERT INTO orders` mà không hề có truy vấn kiểm tra số lượng tồn kho hay trừ kho theo cơ chế giao dịch an toàn tương tranh (Transaction isolation).
- **Các bước tái hiện (Steps to Reproduce):**
  1. Đăng ký và đăng nhập 2 tài khoản riêng biệt: `User 1` (`test@eshop.com`) và `User 2` (`user2@eshop.com`).
  2. Cả `User 1` và `User 2` đều gọi `POST /api/cart` để thêm sản phẩm ID 1 vào giỏ với `quantity = 1`.
  3. `User 1` gửi request `POST /api/checkout` $\rightarrow$ Nhận `200 OK`.
  4. Gần như cùng thời điểm, `User 2` gửi request `POST /api/checkout` cho cùng sản phẩm đó.
- **Kết quả thực tế (Actual Result):** Cả 2 request đều trả về `200 OK`, hai đơn hàng độc lập được tạo ra cho cùng một món hàng duy nhất.
- **Kết quả mong đợi (Expected Result):** Khi số lượng còn 1, chỉ người thanh toán trước được chấp nhận (`200 OK`), người thanh toán sau phải bị từ chối với mã lỗi `400 Bad Request` ("Sản phẩm đã hết hàng / Out of stock"); tồn kho không được phép giảm về âm.

---

### BUG-10: Lỗ hổng Phân quyền Broken Function Level Authorization (BFLA) trên các Endpoint Quản lý Danh mục
- **Mã lỗi:** `BUG-10`
- **API bị ảnh hưởng:** `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` (FR-14 & SEC-03)
- **Mức độ nghiêm trọng:** `Critical (Broken Access Control / OWASP Top 10 API1:2023)`
- **Mô tả:** Theo đặc tả phân hệ Admin (FR-12 & SEC-03), các tác vụ thêm, sửa, xóa danh mục chỉ được phép thực hiện bởi người dùng có vai trò Quản trị viên (`role === 'admin'`). Tuy nhiên, trên hệ thống SUT:
  - Bất kỳ người dùng thông thường nào (`role: 'user'`) chỉ cần có JWT token hợp lệ đều có thể tạo mới, cập nhật tên hoặc xóa sạch các danh mục của hệ thống.
  - Server hoàn toàn không kiểm tra `req.user.role === 'admin'`, trả về `200 OK` cho mọi thao tác phá hoại của người dùng bình thường.
- **Nguyên nhân kỹ thuật:** Các route `/api/categories` trong `server.js` (dòng 249, 257, 269) chỉ sử dụng middleware `authenticateToken` để kiểm tra chữ ký JWT, hoàn toàn thiếu middleware kiểm tra phân quyền Admin (Role-Based Authorization middleware).
- **Các bước tái hiện (Steps to Reproduce):**
  1. Đăng nhập tài khoản người dùng thông thường: `POST /api/login` với `test@eshop.com`.
  2. Dùng token nhận được để gửi request `POST /api/categories` với `{"name": "Unauthorized Category"}`.
  3. Dùng token đó gửi request `DELETE /api/categories/3`.
- **Kết quả thực tế (Actual Result):** Server trả về `200 OK`, tạo danh mục mới và xóa danh mục số 3 thành công bởi user không có quyền Admin.
- **Kết quả mong đợi (Expected Result):** Server phải từ chối truy cập và trả về HTTP `403 Forbidden` ("Yêu cầu quyền Quản trị viên").

---

### BUG-11: Thiếu hoàn toàn Validation Dữ liệu Tên Danh mục trên POST và PUT /api/categories
- **Mã lỗi:** `BUG-11`
- **API bị ảnh hưởng:** `POST /api/categories`, `PUT /api/categories/:id` (FR-14)
- **Mức độ nghiêm trọng:** `Major (Input Validation Flaw)`
- **Mô tả:** Hệ thống không kiểm tra tính hợp lệ của trường `name` khi tạo hoặc cập nhật danh mục:
  - Chấp nhận tạo/sửa danh mục với tên là chuỗi rỗng `""`.
  - Chấp nhận tên chỉ chứa toàn dấu khoảng trắng `"   "`.
  - Chấp nhận giá trị `null` hoặc body rỗng `{}` (khiến cột `name` trong CSDL bị lưu thành `NULL`).
  - Chấp nhận tên là kiểu số `12345`.
- **Nguyên nhân kỹ thuật:** Trong hàm xử lý `POST` và `PUT` tại `server.js` (dòng 249-267), biến `{ name } = req.body` được truyền trực tiếp vào câu lệnh SQL mà không qua bất kỳ bước kiểm tra điều kiện `if (!name || typeof name !== 'string' || name.trim() === '')`.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Đăng nhập tài khoản Admin.
  2. Gửi request `POST /api/categories` với body `{"name": ""}` hoặc `{"name": null}`.
- **Kết quả thực tế (Actual Result):** Trả về `200 OK` kèm `id` và lưu một dòng có tên rỗng/null vào CSDL.
- **Kết quả mong đợi (Expected Result):** Trả về `400 Bad Request` với thông báo "Tên danh mục không được để trống".

---

### BUG-12: Vi phạm Chuẩn RESTful — Endpoint PUT và DELETE luôn trả về 200 OK khi ID Danh mục không tồn tại
- **Mã lỗi:** `BUG-12`
- **API bị ảnh hưởng:** `PUT /api/categories/:id`, `DELETE /api/categories/:id` (FR-14)
- **Mức độ nghiêm trọng:** `Medium (RESTful Semantic Flaw)`
- **Mô tả:** Khi client gửi request cập nhật hoặc xóa một danh mục với `id` không hề tồn tại trong cơ sở dữ liệu (ví dụ: `id = 999999`):
  - Server vẫn trả về HTTP `200 OK` với thông báo `"Category updated"` hoặc `"Category deleted"`.
  - Trạng thái phản hồi này đánh lừa client rằng tài nguyên đã được thao tác thành công, vi phạm nguyên tắc thiết kế RESTful API tiêu chuẩn.
- **Nguyên nhân kỹ thuật:** Trong callback của `db.run("UPDATE ...")` và `db.run("DELETE ...")` tại `server.js` (dòng 263, 274), hệ thống không kiểm tra thuộc tính `this.changes`. Khi `this.changes === 0`, server vẫn mặc định gửi `res.json(...)` với mã trạng thái 200 thay vì kiểm tra và trả về 404.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `DELETE /api/categories/999999` với header token hợp lệ.
  2. Gửi request `PUT /api/categories/999999` với `{"name": "Non-existent"}`.
- **Kết quả thực tế (Actual Result):** Cả hai request đều nhận HTTP `200 OK`.
- **Kết quả mong đợi (Expected Result):** Phải trả về HTTP `404 Not Found` kèm thông báo "Danh mục không tồn tại".

---

### BUG-13: Vi phạm Tính Toàn Vẹn Quan Hệ (Referential Integrity) khi Xóa Danh mục Đang Chứa Sản phẩm
- **Mã lỗi:** `BUG-13`
- **API bị ảnh hưởng:** `DELETE /api/categories/:id` (FR-14)
- **Mức độ nghiêm trọng:** `Major (Data Integrity Flaw)`
- **Mô tả:** Hệ thống cho phép xóa trực tiếp danh mục (ví dụ danh mục ID 1 "Điện thoại") trong khi vẫn còn nhiều sản phẩm trong bảng `products` đang liên kết với danh mục này (`category_id = 1`, ví dụ iPhone 15, Samsung Galaxy S24):
  - Sau khi xóa, các sản phẩm này vẫn tồn tại nhưng có `category_id` trỏ vào một ID không còn tồn tại trong bảng `categories`.
  - Điều này tạo ra các bản ghi mồ côi (Orphaned Records) trong CSDL, gây lỗi phân loại sản phẩm trên giao diện người dùng và hỏng cấu trúc dữ liệu liên kết.
- **Nguyên nhân kỹ thuật:** `DELETE /api/categories/:id` tại `server.js` không thực hiện truy vấn kiểm tra `SELECT COUNT(*) FROM products WHERE category_id = ?` trước khi xóa, đồng thời cơ chế khóa ngoại `PRAGMA foreign_keys = ON;` không được cấu hình chặt chẽ trong SQLite.
- **Các bước tái hiện (Steps to Reproduce):**
  1. Gửi request `DELETE /api/categories/1`.
  2. Gửi request `GET /api/products` kiểm tra các sản phẩm có `category_id = 1`.
- **Kết quả thực tế (Actual Result):** Danh mục 1 bị xóa thành công (`200 OK`), các sản phẩm vẫn trỏ vào `category_id = 1` nhưng danh mục đã biến mất.
- **Kết quả mong đợi (Expected Result):** Server phải từ chối xóa và trả về HTTP `400 Bad Request` hoặc `409 Conflict` kèm thông báo "Không thể xóa danh mục đang có sản phẩm liên kết".



