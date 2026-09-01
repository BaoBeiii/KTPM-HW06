# Danh Sách Chi Tiết Ca Kiểm Thử (API Test Cases)

- **Hệ thống kiểm thử (SUT):** EShop Backend API
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: 23127327)
- **Cấu trúc bộ kiểm thử:**
  - **Mục 1:** API 1 — Pool A (FR-02: Đăng nhập & Khóa tài khoản)
  - **Mục 2:** API 2 — Pool B (FR-08: Đặt hàng / Checkout) *(Sẽ bổ sung tại Phase 4)*
  - **Mục 3:** API 3 — Pool C (FR-14: Quản lý Danh mục CRUD) *(Sẽ bổ sung tại Phase 5)*

---

# 1. API 1: FR-02 Đăng Nhập & Khóa Tài Khoản (`POST /api/login`)

## 1.1. Tập Ca Kiểm Thử Sinh Bởi AI (AI-Generated Test Cases) & Kết Quả Thẩm Định (Human Audit)

| Test ID | Phân loại | Tên ca kiểm thử | Dữ liệu đầu vào (Request Body) | Kỳ vọng theo Đặc tả (Expected Result) | Thẩm định (Human Audit) | Lý do & Hiệu chỉnh (Reasoning & Correction) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-A01** | Domain (Valid) | Đăng nhập thành công với tài khoản User | `{"email": "test@eshop.com", "password": "Test1234!"}` | 200 OK, trả về token JWT và thông tin user (`role: "user"`) | **VALID** | Phù hợp 100% với mục 1.2 đặc tả API và tài khoản seed. |
| **TC-A02** | Domain (Valid) | Đăng nhập thành công với tài khoản Admin | `{"email": "admin@eshop.com", "password": "Admin123!"}` | 200 OK, trả về token JWT và user (`role: "admin"`) | **VALID** | Phù hợp với tài khoản Admin mặc định của hệ thống. |
| **TC-A03** | Domain (Invalid) | Email sai định dạng (thiếu ký tự `@`) | `{"email": "testeshop.com", "password": "Test1234!"}` | 400 Bad Request, thông báo lỗi định dạng email | **VALID** | Phù hợp FR-02: email phải có format hợp lệ (`type="email"`). |
| **TC-A04** | Domain (Invalid) | Email sai định dạng (thiếu domain sau `@`) | `{"email": "test@", "password": "Test1234!"}` | 400 Bad Request | **VALID** | Kiểm tra phân vùng email không có domain. |
| **TC-A05** | Domain (Invalid) | Email chứa ký tự đặc biệt không hợp lệ trong domain | `{"email": "test@domain..com", "password": "Test1234!"}` | 400 Bad Request | **VALID** | Kiểm tra cú pháp RFC email domain. |
| **TC-A06** | Domain (Boundary) | Email là chuỗi rỗng `""` | `{"email": "", "password": "Test1234!"}` | 400 Bad Request | **VALID** | Trường email bắt buộc, không được để rỗng. |
| **TC-A07** | Domain (Invalid) | Email nhận giá trị `null` | `{"email": null, "password": "Test1234!"}` | 400 Bad Request | **VALID** | Xử lý kiểu dữ liệu không hợp lệ. |
| **TC-A08** | Domain (Boundary) | Email chỉ chứa khoảng trắng `"   "` | `{"email": "   ", "password": "Test1234!"}` | 400 Bad Request | **VALID** | Khoảng trắng không được coi là email hợp lệ. |
| **TC-A09** | Domain (Invalid) | Email chưa từng đăng ký trong hệ thống | `{"email": "nonexistent_999@eshop.com", "password": "Test1234!"}` | 401 Unauthorized, thông báo lỗi chung không lộ thông tin | **VALID** | Đúng yêu cầu FR-02: không để lộ chi tiết nguyên nhân lỗi. |
| **TC-A10** | Domain (Boundary) | Password là chuỗi rỗng `""` | `{"email": "test@eshop.com", "password": ""}` | 400 Bad Request | **VALID** | Mật khẩu bắt buộc nhập. |
| **TC-A11** | Domain (Invalid) | Password nhận giá trị `null` | `{"email": "test@eshop.com", "password": null}` | 400 Bad Request | **VALID** | Xử lý kiểu dữ liệu null cho password. |
| **TC-A12** | Domain (Invalid) | Sai mật khẩu hoàn toàn | `{"email": "test@eshop.com", "password": "WrongPassword999!"}` | 401 Unauthorized (`Invalid email or password`) | **VALID** | Kiểm tra xác thực thất bại. |
| **TC-A13** | Domain (Invalid) | Password sai chữ hoa/thường (Case sensitivity) | `{"email": "test@eshop.com", "password": "test1234!"}` | 401 Unauthorized | **VALID** | Mật khẩu phải bảo toàn tính phân biệt hoa thường. |
| **TC-A14** | Domain (Boundary) | Request body rỗng hoàn toàn `{}` | `{}` | 400 Bad Request | **VALID** | Kiểm tra thiếu cả email và password. |
| **TC-A15** | Domain (Boundary) | Thiếu trường `email` trong JSON | `{"password": "Test1234!"}` | 400 Bad Request | **VALID** | Kiểm tra schema thiếu trường bắt buộc. |
| **TC-A16** | Domain (Boundary) | Thiếu trường `password` trong JSON | `{"email": "test@eshop.com"}` | 400 Bad Request | **VALID** | Kiểm tra schema thiếu trường bắt buộc. |
| **TC-A17** | Domain (Boundary) | Gửi kèm trường thừa `role: "admin"` | `{"email": "test@eshop.com", "password": "Test1234!", "role": "admin"}` | 200 OK, không được cấp quyền admin cho user thường | **INCOMPLETE** | AI ban đầu chỉ assert status 200. Hiệu chỉnh: Phải assert thêm `response.user.role === 'user'` để ngăn Privilege Escalation. |
| **TC-A18** | Boundary (Length) | Password độ dài 7 ký tự (dưới ngưỡng 8 ký tự) | `{"email": "test@eshop.com", "password": "Pass12!"}` | 400 hoặc 401 Unauthorized | **VALID** | Phân tích giá trị biên dưới độ dài mật khẩu FR-01/02. |
| **TC-A19** | Boundary (Length) | Password độ dài 8 ký tự (vừa chạm ngưỡng chuẩn) | `{"email": "test@eshop.com", "password": "Pass123!"}` | 401 Unauthorized (sai pass) | **VALID** | Kiểm tra giá trị biên chuẩn. |
| **TC-A20** | Boundary (Length) | Email có độ dài cực lớn (255 ký tự) | `{"email": "a".repeat(245) + "@eshop.com", "password": "Test1234!"}` | 400 hoặc 401 | **VALID** | Kiểm tra giới hạn bộ nhớ đệm và buffer overflow. |
| **TC-A21** | Boundary (Length) | Password có độ dài cực lớn (1000 ký tự) | `{"email": "test@eshop.com", "password": "A".repeat(1000) + "1!"}` | 401 Unauthorized | **VALID** | Ngăn chặn DoS qua độ dài password hashing. |
| **TC-A22** | Domain (Format) | Email có khoảng trắng ở đầu và cuối | `{"email": "  test@eshop.com  ", "password": "Test1234!"}` | 200 OK (nếu trim) hoặc 400/401 | **INCOMPLETE** | AI kỳ vọng 200 cứng. Hiệu chỉnh: Kiểm tra hành vi trim chuỗi hoặc từ chối hợp lý. |
| **TC-A23** | State (Lockout) | Đăng nhập sai lần 1 với tài khoản kiểm thử lockout | `{"email": "lockout_demo@eshop.com", "password": "Wrong1"}` | 401 Unauthorized, login_attempts tăng lên 1 | **VALID** | Bắt đầu chu kỳ máy trạng thái lockout. |
| **TC-A24** | State (Lockout) | Đăng nhập sai lần 2 liên tiếp | `{"email": "lockout_demo@eshop.com", "password": "Wrong2"}` | 401 Unauthorized, login_attempts tăng lên 2 | **VALID** | Kiểm tra bước nhảy bộ đếm = 1. |
| **TC-A25** | State (Lockout) | Đăng nhập sai lần 3 liên tiếp $\rightarrow$ Kích hoạt khóa tài khoản | `{"email": "lockout_demo@eshop.com", "password": "Wrong3"}` | 401 hoặc 403, tài khoản bị tạm khóa 30 giây | **VALID** | Kiểm tra chuyển trạng thái từ Active sang Locked. |
| **TC-A26** | State (Lockout) | Đăng nhập lần thứ 4 khi tài khoản đang bị khóa (gửi pass ĐÚNG) | `{"email": "lockout_demo@eshop.com", "password": "CorrectPassword123!"}` | 403 Forbidden ("Tài khoản đã bị khóa. Vui lòng thử lại sau.") | **VALID** | Ràng buộc: Khi đang bị khóa, dù đúng mật khẩu vẫn phải bị từ chối 403. |
| **TC-A27** | State (Lockout) | Đăng nhập lần thứ 5 khi tài khoản đang bị khóa (gửi pass SAI) | `{"email": "lockout_demo@eshop.com", "password": "WrongAgain"}` | 403 Forbidden | **VALID** | Kiểm tra duy trì trạng thái khóa. |
| **TC-A28** | State (Reset) | Đăng nhập đúng mật khẩu sau 1 lần sai $\rightarrow$ Reset đếm về 0 | `{"email": "test@eshop.com", "password": "Test1234!"}` | 200 OK, reset login_attempts = 0 | **VALID** | Đảm bảo đăng nhập đúng sẽ xóa chu kỳ đếm sai. |
| **TC-A29** | Security (SEC-05) | SQL Injection cơ bản trong trường Email (`' OR '1'='1`) | `{"email": "' OR '1'='1", "password": "anything"}` | 400 hoặc 401 Unauthorized, tuyệt đối không bypass đăng nhập | **VALID** | Bắt buộc kiểm tra Parameterized Query theo SEC-05. |
| **TC-A30** | Security (SEC-05) | SQL Injection trong trường Password (`' OR '1'='1`) | `{"email": "admin@eshop.com", "password": "' OR '1'='1"}` | 401 Unauthorized, không bypass được admin | **VALID** | Kiểm tra xác thực mật khẩu an toàn. |
| **TC-A31** | Security (SEC-05) | SQL Injection dạng comment (`admin@eshop.com'--`) | `{"email": "admin@eshop.com'--", "password": "fake"}` | 401 Unauthorized | **VALID** | Ngăn chặn syntax comment SQLite. |
| **TC-A32** | Security (SEC-05) | SQL Injection với mệnh đề UNION SELECT | `{"email": "test@eshop.com' UNION SELECT 1,2,3--", "password": "p"}` | 401 Unauthorized | **VALID** | Ngăn chặn trích xuất dữ liệu qua UNION. |
| **TC-A33** | Security (SEC-01) | Phản hồi không để lộ mật khẩu trong user object | `{"email": "test@eshop.com", "password": "Test1234!"}` | 200 OK, `response.user.password` phải là `undefined` | **VALID** | Đáp ứng yêu cầu SEC-01: không lộ mật khẩu. |
| **TC-A34** | Security (Format) | NoSQL / Object Injection trong body JSON | `{"email": {"$gt": ""}, "password": {"$gt": ""}}` | 400 Bad Request | **VALID** | Phòng thủ trường hợp nhận object thay vì chuỗi. |
| **TC-A35** | Security (Headers) | Request gửi Content-Type không hợp lệ (`text/plain`) | `"email=test@eshop.com&password=Test1234!"` | 400 Bad Request hoặc 415 Unsupported Media Type | **VALID** | Đảm bảo endpoint chỉ xử lý application/json. |
| **TC-A36** | Schema (Token) | Kiểm định cấu trúc JWT Token trả về | `{"email": "test@eshop.com", "password": "Test1234!"}` | Token có 3 phần tách bởi dấu chấm (`header.payload.sig`) | **VALID** | Kiểm định định dạng Token JWT theo chuẩn RFC 7519. |
| **TC-A37** | Schema (User) | Kiểm định Schema chi tiết của đối tượng `user` | `{"email": "test@eshop.com", "password": "Test1234!"}` | Chứa các trường bắt buộc: `id` (int), `name` (str), `email` (str), `role` (str) | **VALID** | Khớp 100% cấu trúc schema mục 1.2. |
| **TC-A38** | Schema (Message) | Kiểm định trường thông báo thành công | `{"email": "test@eshop.com", "password": "Test1234!"}` | `response.message === "Login successful"` | **VALID** | Chuẩn hóa thông điệp phản hồi API. |

---

## 1.2. Các Ca Kiểm Thử Mở Rộng Do Con Người Thiết Kế (Human Extensions)

Dưới đây là **6 ca kiểm thử chuyên sâu** do con người bổ sung mà AI ban đầu bỏ sót:

| Test ID | Tên ca kiểm thử mở rộng | Request Body / Kịch bản thực thi | Kết quả mong đợi theo Đặc tả | Lý do AI bỏ sót (Why AI Missed It) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-EXT-01** | Đăng nhập với Email chữ HOA (`case-insensitive`) | `{"email": "TEST@ESHOP.COM", "password": "Test1234!"}` | 200 OK, đăng nhập thành công do email không phân biệt hoa thường theo tiêu chuẩn quốc tế. | **Hạn chế về ngữ cảnh của AI:** AI chỉ áp dụng chuỗi string matching đơn thuần (`===`) thay vì hiểu tiêu chuẩn RFC email xử lý case-insensitive. |
| **TC-EXT-02** | Giải mã Token Payload kiểm tra tính hợp lệ của Claim | Đăng nhập lấy token $\rightarrow$ Decode Base64 Payload $\rightarrow$ Assert `payload.id === user.id` và `payload.role === user.role` | 200 OK, Claims trong JWT Token khớp hoàn toàn với thông tin người dùng được xác thực. | **AI thiếu khả năng tích hợp test script phức tạp:** AI chỉ kiểm tra sự tồn tại của chuỗi token, không viết script giải mã Base64 payload để kiểm tra tính toàn vẹn dữ liệu bên trong token. |
| **TC-EXT-03** | Gửi cú pháp Malformed JSON (Lỗi cú pháp body) | Gửi chuỗi JSON lỗi: `{email: "test@eshop.com", password` | 400 Bad Request với thông báo lỗi cú pháp JSON, không gây crash server hoặc lộ stack trace. | **AI mặc định client hoàn hảo:** AI luôn giả định payload gửi lên máy chủ là JSON hợp lệ, bỏ qua kiểm thử khả năng phòng thủ của Parser middleware. |
| **TC-EXT-04** | Kiểm tra độ trễ phản hồi (Timing Attack Defense) | Đo chênh lệch thời gian phản hồi giữa user tồn tại (`test@eshop.com`) và user không tồn tại (`nosuchuser@eshop.com`) | Chênh lệch thời gian nhỏ ($< 200ms$), không để lộ sự tồn tại của tài khoản qua thời gian phản hồi. | **Đặc tính phi chức năng:** AI tập trung vào chức năng (Functional testing), ít khi tự động thiết kế các ca kiểm thử bảo mật phi chức năng (Non-functional Security). |
| **TC-EXT-05** | Đăng nhập với Email có ký tự Unicode tiếng Việt | `{"email": "nguyễnvana@eshop.com", "password": "Password123!"}` | 400 Bad Request hoặc xử lý UTF-8 an toàn, không gây lỗi database unhandled exception. | **Thiên lệch ngôn ngữ của AI:** AI có xu hướng sinh dữ liệu chuẩn tiếng Anh (ASCII), bỏ sót các trường hợp mã hóa ký tự UTF-8 đa byte. |
| **TC-EXT-06** | Mở khóa tự động sau khi hết thời hạn 30 giây | Sau khi tài khoản bị khóa $\rightarrow$ Chờ 30 giây $\rightarrow$ Gửi request đăng nhập với mật khẩu đúng | 200 OK, tài khoản tự động mở khóa và reset số lần sai về 0 theo đúng FR-02. | **AI thiếu mô hình hóa thời gian (Time-based State Transition):** AI chỉ sinh các transition tức thời, bỏ qua chu trình tự động chuyển trạng thái theo bộ đếm thời gian (timer-based transition). |

---

## 1.3. Tổng Kết Số Lượng Ca Kiểm Thử API 1:
- **Số ca kiểm thử do AI sinh ra:** 38 ca kiểm thử
- **Số ca kiểm thử được thẩm định:** 38 ca kiểm thử (36 VALID, 2 INCOMPLETE được hiệu chỉnh)
- **Số ca kiểm thử mở rộng bởi con người:** 6 ca kiểm thử
- **Tổng số ca kiểm thử thực thi cho API 1:** **44 ca kiểm thử**

---

# 2. API 2: FR-08 Đặt Hàng / Thanh Toán (`POST /api/checkout`)

## 2.1. Tập Ca Kiểm Thử Sinh Bởi AI (AI-Generated Test Cases) & Kết Quả Thẩm Định (Human Audit)

| Test ID | Phân loại | Tên ca kiểm thử | Dữ liệu đầu vào (Request Body & Headers) | Kỳ vọng theo Đặc tả (Expected Result) | Thẩm định (Human Audit) | Lý do & Hiệu chỉnh (Reasoning & Correction) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-B01** | Domain (Valid) | Checkout thành công với giỏ hàng có sản phẩm | `{"total_amount": 30000000, "shipping_address": "123 Le Loi, Q1, TP.HCM"}` | 200 OK, `message: "Checkout successful"`, `orderId` là số nguyên dương | **VALID** | Phù hợp mục 4.3 đặc tả API khi người dùng đã có hàng trong giỏ. |
| **TC-B02** | Domain (Valid) | `total_amount` là số nguyên dương hợp lệ | `{"total_amount": 200000, "shipping_address": "456 Nguyen Hue, Q1"}` | 200 OK | **VALID** | Kiểm tra phân vùng giá trị dương hợp lệ. |
| **TC-B03** | Domain (Boundary) | `total_amount` là số thực dấu phẩy động (float) | `{"total_amount": 199999.5, "shipping_address": "123 Le Loi"}` | 200 OK hoặc 400 Bad Request | **VALID** | Kiểm tra xử lý kiểu số thực trong tiền tệ VND (không có đơn vị xu lẻ). |
| **TC-B04** | Domain (Boundary) | `total_amount` bằng 0 | `{"total_amount": 0, "shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Đơn hàng không thể có giá trị bằng 0 khi có sản phẩm. |
| **TC-B05** | Domain (Invalid) | `total_amount` là số âm | `{"total_amount": -50000, "shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Tổng tiền thanh toán không được phép âm. |
| **TC-B06** | Domain (Invalid) | `total_amount` là chuỗi số (`"200000"`) | `{"total_amount": "200000", "shipping_address": "123 Le Loi"}` | 200 OK (nếu ép kiểu) hoặc 400 | **INCOMPLETE** | AI kỳ vọng 200. Hiệu chỉnh: Cần xác thực backend có ép kiểu an toàn hay từ chối strict type. |
| **TC-B07** | Domain (Invalid) | `total_amount` là chuỗi chữ | `{"total_amount": "hai trăm nghìn", "shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Chuỗi chữ không thể parse thành số tiền. |
| **TC-B08** | Domain (Invalid) | `total_amount` là kiểu boolean `true` | `{"total_amount": true, "shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Ngăn chặn Type Juggling / Coercion trong Javascript. |
| **TC-B09** | Domain (Invalid) | `total_amount` nhận giá trị `null` | `{"total_amount": null, "shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Trường tổng tiền bắt buộc, không được null. |
| **TC-B10** | Boundary (Extreme) | `total_amount` là số cực lớn ($10^{12}$) | `{"total_amount": 1000000000000, "shipping_address": "123 Le Loi"}` | 400 Bad Request hoặc 200 OK | **VALID** | Kiểm tra tràn số nguyên (Integer Overflow) trong SQLite. |
| **TC-B11** | Domain (Boundary) | Thiếu trường `total_amount` trong body | `{"shipping_address": "123 Le Loi"}` | 400 Bad Request | **VALID** | Thiếu trường bắt buộc theo đặc tả schema. |
| **TC-B12** | Domain (Valid) | `shipping_address` địa chỉ tiêu chuẩn | `{"total_amount": 200000, "shipping_address": "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"}` | 200 OK | **VALID** | Phân vùng địa chỉ hợp lệ. |
| **TC-B13** | Domain (Boundary) | `shipping_address` là chuỗi rỗng `""` | `{"total_amount": 200000, "shipping_address": ""}` | 400 Bad Request | **VALID** | Địa chỉ giao hàng không được phép để rỗng. |
| **TC-B14** | Domain (Boundary) | `shipping_address` chỉ chứa khoảng trắng `"   "` | `{"total_amount": 200000, "shipping_address": "   "}` | 400 Bad Request | **VALID** | Không chấp nhận địa chỉ vô nghĩa gồm toàn dấu cách. |
| **TC-B15** | Domain (Invalid) | `shipping_address` nhận giá trị `null` | `{"total_amount": 200000, "shipping_address": null}` | 400 Bad Request | **VALID** | Bắt buộc kiểu dữ liệu string cho địa chỉ. |
| **TC-B16** | Domain (Invalid) | `shipping_address` là kiểu số `12345` | `{"total_amount": 200000, "shipping_address": 12345}` | 400 Bad Request | **VALID** | Sai kiểu dữ liệu trường địa chỉ. |
| **TC-B17** | Boundary (Length) | `shipping_address` độ dài tối thiểu 1 ký tự (`"A"`) | `{"total_amount": 200000, "shipping_address": "A"}` | 400 Bad Request | **VALID** | Địa chỉ 1 ký tự không đủ cấu trúc giao hàng hợp lệ. |
| **TC-B18** | Boundary (Length) | `shipping_address` cực dài (1000 ký tự) | `{"total_amount": 200000, "shipping_address": "X".repeat(1000)}` | 400 Bad Request hoặc 200 OK | **VALID** | Kiểm tra giới hạn độ dài trường TEXT trong CSDL. |
| **TC-B19** | Domain (Format) | `shipping_address` chứa tiếng Việt có dấu Unicode đầy đủ | `{"total_amount": 200000, "shipping_address": "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"}` | 200 OK | **VALID** | Hỗ trợ ký tự tiếng Việt UTF-8 chuẩn. |
| **TC-B20** | Domain (Boundary) | Thiếu trường `shipping_address` trong body | `{"total_amount": 200000}` | 400 Bad Request | **VALID** | Không thể giao hàng nếu thiếu địa chỉ. |
| **TC-B21** | Domain (Boundary) | Body rỗng hoàn toàn `{}` | `{}` | 400 Bad Request | **VALID** | Thiếu toàn bộ thông tin thanh toán. |
| **TC-B22** | Domain (Security) | Client gửi kèm trường thừa `status: "delivered"` | `{"total_amount": 200000, "shipping_address": "123 Le Loi", "status": "delivered"}` | 200 OK, nhưng trạng thái đơn tạo ra trong DB bắt buộc phải là `pending` | **INCOMPLETE** | AI ban đầu chỉ assert status 200. Hiệu chỉnh: Bắt buộc gọi `GET /api/orders/my-orders` để kiểm tra đơn hàng không bị client gán đè `status: delivered` (Mass Assignment Vulnerability). |
| **TC-B23** | State (Cart) | Checkout khi giỏ hàng RỖNG (`userCarts = []`) | `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | 400 Bad Request ("Giỏ hàng rỗng không thể thanh toán") | **VALID** | Ràng buộc nghiệp vụ FR-08: không thể tạo đơn khi giỏ rỗng. |
| **TC-B24** | State (Cart) | Nạp 1 sản phẩm vào giỏ $\rightarrow$ Thực hiện Checkout | `{"total_amount": 30000000, "shipping_address": "123 Le Loi"}` | 200 OK, tạo đơn thành công | **VALID** | Luồng chuẩn đặt hàng với 1 item. |
| **TC-B25** | State (Cart) | Xác minh giỏ hàng bị XÓA SẠCH sau khi Checkout thành công | Gọi `GET /api/cart` ngay sau khi `POST /api/checkout` | 200 OK, trả về mảng rỗng `[]` | **VALID** | Ràng buộc rõ ràng trong FR-08: "Sau thanh toán thành công, giỏ hàng được xóa". |
| **TC-B26** | State (Order) | Xác minh trạng thái ban đầu của đơn hàng mới tạo là `pending` | Gọi `GET /api/orders/my-orders` kiểm tra đơn mới nhất | Đơn hàng có `status === "pending"` | **VALID** | Khớp sơ đồ State Machine FR-10: trạng thái khởi đầu luôn là `pending`. |
| **TC-B27** | State (Cart) | Nạp nhiều sản phẩm khác nhau vào giỏ $\rightarrow$ Checkout | `{"total_amount": 75000000, "shipping_address": "123 Le Loi"}` | 200 OK | **VALID** | Luồng đặt hàng với nhiều mặt hàng. |
| **TC-B28** | State (Order) | Đơn hàng mới tạo phải liên kết đúng `user_id` của Token | Gọi `GET /api/orders/my-orders` | `order.user_id === user.id` | **VALID** | Đảm bảo tính toàn vẹn và phân tách dữ liệu người dùng. |
| **TC-B29** | Security (SEC-02) | Request không gửi Header `Authorization` (Unauthenticated) | Không có Authorization header | 401 Unauthorized | **VALID** | Ràng buộc SEC-02: Bắt buộc có token JWT hợp lệ. |
| **TC-B30** | Security (SEC-02) | Token JWT sai định dạng hoặc chữ ký giả mạo | `Authorization: Bearer invalid_jwt_token_123` | 403 Forbidden | **VALID** | Kiểm tra xác thực chữ ký số JWT. |
| **TC-B31** | Security (SEC-02) | Token JWT rỗng (`Bearer `) | `Authorization: Bearer ` | 401 Unauthorized hoặc 403 | **VALID** | Xử lý header Authorization rỗng. |
| **TC-B32** | Security (SEC-04) | Stored XSS trong trường `shipping_address` (`<script>`) | `{"total_amount": 200000, "shipping_address": "<script>alert('XSS')</script>"}` | Dữ liệu phải được sanitize hoặc escape, không lưu script thực thi | **VALID** | Tuân thủ yêu cầu SEC-04: escape dữ liệu người dùng. |
| **TC-B33** | Security (SEC-04) | HTML Tag Injection trong `shipping_address` | `{"total_amount": 200000, "shipping_address": "<img src=x onerror=alert(1)>"}` | Được sanitize an toàn | **VALID** | Phòng thủ vector tấn công HTML event injection. |
| **TC-B34** | Security (SEC-05) | SQL Injection trong trường `shipping_address` | `{"total_amount": 200000, "shipping_address": "123 Le Loi', 'delivered'); --"}` | 400 Bad Request hoặc chuỗi được escape trong Parameterized query | **VALID** | Bắt buộc kiểm tra Parameterized Query theo SEC-05. |
| **TC-B35** | Security (Business) | Lỗ hổng Price Tampering: Client gửi giá rẻ hơn giá trị thực trong giỏ | `{"total_amount": 1000, "shipping_address": "123 Le Loi"}` (Giỏ hàng có SP 30,000,000đ) | Backend phải tự tính lại tổng tiền = 30,000,000đ hoặc từ chối request | **VALID** | Ràng buộc then chốt của FR-08: "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount do client gửi lên". |
| **TC-B36** | Schema (Response) | Kiểm định cấu trúc response thành công của API Checkout | `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | Response chứa đúng 2 trường: `message: "Checkout successful"` và `orderId` (number) | **VALID** | Khớp 100% schema mục 4.3 đặc tả API. |

---

## 2.2. Các Ca Kiểm Thử Mở Rộng Do Con Người Thiết Kế (Human Extensions)

Dưới đây là **7 ca kiểm thử chuyên sâu** do con người bổ sung mà AI ban đầu bỏ sót:


| Test ID | Tên ca kiểm thử mở rộng | Request Body / Kịch bản thực thi | Kết quả mong đợi theo Đặc tả | Lý do AI bỏ sót (Why AI Missed It) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-EXT-07** | Price Tampering với số tiền bằng 0 (Free Order Exploit) | Nạp sản phẩm 30tr vào giỏ $\rightarrow$ Gửi `total_amount = 0` | Backend từ chối đơn hàng 0đ hoặc tự tính lại 30tr, tuyệt đối không tạo đơn 0đ. | **AI bỏ sót lỗ hổng gian lận logic:** AI thường chỉ kiểm tra số dương ngẫu nhiên, bỏ sót kịch bản kẻ tấn công cố tình mua hàng miễn phí bằng cách gửi 0đ. |
| **TC-EXT-08** | Kiểm tra tính toàn vẹn trạng thái giỏ hàng (Cart State Persistence Check) | Chuỗi 3 requests liên hoàn: `POST /api/cart` $\rightarrow$ `POST /api/checkout` $\rightarrow$ `GET /api/cart` | Giỏ hàng sau checkout phải có độ dài mảng bằng đúng 0 (`length === 0`). | **Hạn chế kiểm thử đơn lẻ của AI:** AI chỉ thiết kế request checkout độc lập, không xâu chuỗi kịch bản gọi lại API giỏ hàng để xác nhận trạng thái dữ liệu đã bị xóa. |
| **TC-EXT-09** | BOLA / IDOR: Giả mạo `user_id` trong body checkout | Gửi `{"user_id": 9999, "total_amount": 200000, "shipping_address": "123 Le Loi"}` | Đơn hàng tạo ra phải luôn thuộc về `req.user.id` từ JWT Token, không bị gán cho user 9999. | **AI thiếu tư duy phòng thủ tham số thừa:** AI không lường trước việc client cố tình chèn thêm ID của người khác để tạo đơn nặc danh. |
| **TC-EXT-10** | Kiểm tra XSS khi đọc lại đơn hàng (Stored XSS Retrieval Check) | Gửi `shipping_address` chứa XSS payload $\rightarrow$ Gọi `GET /api/orders/my-orders` | Dữ liệu trả về không bị trigger script hoặc đã được mã hóa an toàn. | **AI thiếu kiểm thử vòng đời dữ liệu (Lifecycle verification):** AI chỉ kiểm tra lúc gửi vào (Input), không kiểm tra lúc dữ liệu được đọc ra và hiển thị (Output). |
| **TC-EXT-11** | Kiểm tra xử lý Content-Type không hợp lệ | Gửi request checkout với Content-Type `application/x-www-form-urlencoded` | 400 Bad Request hoặc 415 Unsupported Media Type. | **AI mặc định môi trường chuẩn:** AI giả định client luôn luôn gửi `application/json`. |
| **TC-EXT-12** | Race Condition: Gửi 2 request Checkout liên tiếp cực nhanh cùng lúc | Gửi 2 request checkout gần như đồng thời trên cùng 1 giỏ hàng có 1 sản phẩm | Chỉ 1 đơn hàng được tạo thành công, request thứ hai phải bị từ chối vì giỏ hàng đã được xóa. | **AI thiếu kiểm thử tương tranh (Concurrency Testing):** AI chỉ sinh các ca kiểm thử tuần tự đơn luồng. |
| **TC-EXT-13** | Kiểm thử tương tranh tồn kho (Overselling & Negative Stock Race Condition): 2 người dùng đồng thời thanh toán cùng 1 sản phẩm khi số lượng chỉ còn 1 | Hai người dùng khác nhau (`User 1` và `User 2`) cùng cho 1 sản phẩm duy nhất vào giỏ và đồng thời gửi `POST /api/checkout` | Hệ thống phải có cơ chế khóa tương tranh (Pessimistic/Optimistic Lock hoặc Atomic Transaction): Chỉ 1 người được đặt hàng thành công, người còn lại nhận thông báo lỗi hết hàng (Out of stock - HTTP 400); số lượng tồn kho không được phép bị giảm về âm (`stock < 0`). | **Yêu cầu mở rộng chuyên sâu từ người dùng / AI bỏ sót tương tranh đa tài khoản:** AI chỉ giả định kiểm thử tuần tự trên 1 phiên người dùng đơn lẻ, không tự động thiết kế kịch bản 2 tài khoản cùng tranh chấp tài nguyên duy nhất (Resource Contention). |

---

## 2.3. Tổng Kết Số Lượng Ca Kiểm Thử API 2:
- **Số ca kiểm thử do AI sinh ra:** 36 ca kiểm thử
- **Số ca kiểm thử được thẩm định:** 36 ca kiểm thử (34 VALID, 2 INCOMPLETE được hiệu chỉnh)
- **Số ca kiểm thử mở rộng bởi con người:** 7 ca kiểm thử (bổ sung TC-EXT-13 kiểm thử tồn kho & Overselling)
- **Tổng số ca kiểm thử thực thi cho API 2:** **43 ca kiểm thử**

---

# 3. API 3: FR-14 Quản Lý Danh Mục CRUD (`/api/categories`)

## 3.1. Tập Ca Kiểm Thử Sinh Bởi AI (AI-Generated Test Cases) & Kết Quả Thẩm Định (Human Audit)

| Test ID | Phân loại | Tên ca kiểm thử | Dữ liệu đầu vào (Method, Endpoint & Body) | Kỳ vọng theo Đặc tả (Expected Result) | Thẩm định (Human Audit) | Lý do & Hiệu chỉnh (Reasoning & Correction) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-C01** | Domain (Read) | Lấy danh sách toàn bộ danh mục | `GET /api/categories` | 200 OK, trả về mảng các đối tượng `[{id, name}]` | **VALID** | Phù hợp mục 3.4 đặc tả API. |
| **TC-C02** | Domain (Create) | Admin tạo mới danh mục hợp lệ | `POST /api/categories` body `{"name": "Thời trang nam"}` | 200 OK, `message: "Category created"`, `id` là số nguyên dương | **VALID** | Luồng chuẩn tạo danh mục của Admin. |
| **TC-C03** | Domain (Update) | Admin cập nhật tên danh mục theo ID | `PUT /api/categories/:id` body `{"name": "Thời trang nam cao cấp"}` | 200 OK, `message: "Category updated"` | **VALID** | Luồng chuẩn sửa tên danh mục. |
| **TC-C04** | Domain (Delete) | Admin xóa danh mục theo ID | `DELETE /api/categories/:id` | 200 OK, `message: "Category deleted"` | **VALID** | Luồng chuẩn xóa danh mục. |
| **TC-C05** | Domain (Boundary) | Tạo danh mục với tên là chuỗi rỗng `""` | `POST /api/categories` body `{"name": ""}` | 400 Bad Request ("Tên danh mục không được để trống") | **VALID** | Ràng buộc FR-14: Tên danh mục bắt buộc nhập. |
| **TC-C06** | Domain (Boundary) | Tạo danh mục với tên chỉ chứa khoảng trắng `"   "` | `POST /api/categories` body `{"name": "   "}` | 400 Bad Request | **VALID** | Khoảng trắng không phải tên hợp lệ. |
| **TC-C07** | Domain (Invalid) | Tạo danh mục với tên nhận giá trị `null` | `POST /api/categories` body `{"name": null}` | 400 Bad Request | **VALID** | Bắt buộc kiểu string cho tên danh mục. |
| **TC-C08** | Domain (Boundary) | Tạo danh mục thiếu trường `name` trong body `{}` | `POST /api/categories` body `{}` | 400 Bad Request | **VALID** | Thiếu trường bắt buộc trong schema. |
| **TC-C09** | Domain (Invalid) | Tạo danh mục với tên là kiểu số `12345` | `POST /api/categories` body `{"name": 12345}` | 400 Bad Request | **VALID** | Sai kiểu dữ liệu trường name. |
| **TC-C10** | Boundary (Length) | Tạo danh mục với tên độ dài tối thiểu 1 ký tự (`"A"`) | `POST /api/categories` body `{"name": "A"}` | 200 OK | **VALID** | Kiểm tra giá trị biên dưới độ dài tên. |
| **TC-C11** | Boundary (Length) | Tạo danh mục với tên chuẩn 255 ký tự | `POST /api/categories` body `{"name": "D".repeat(255)}` | 200 OK | **VALID** | Kiểm tra giá trị biên trên độ dài tên. |
| **TC-C12** | Boundary (Length) | Tạo danh mục với tên cực dài (1000 ký tự) | `POST /api/categories` body `{"name": "D".repeat(1000)}` | 400 Bad Request hoặc 200 OK | **VALID** | Kiểm tra xử lý chuỗi cực lớn trong database. |
| **TC-C13** | Domain (Format) | Tạo danh mục với tiếng Việt có dấu Unicode | `POST /api/categories` body `{"name": "Đồ gia dụng & Thiết bị nhà bếp"}` | 200 OK | **VALID** | Hỗ trợ tiếng Việt UTF-8 chuẩn. |
| **TC-C14** | Domain (Boundary) | Cập nhật danh mục với tên rỗng `""` | `PUT /api/categories/:id` body `{"name": ""}` | 400 Bad Request | **VALID** | Không cho phép cập nhật tên thành rỗng. |
| **TC-C15** | Domain (Invalid) | Cập nhật danh mục với tên nhận giá trị `null` | `PUT /api/categories/:id` body `{"name": null}` | 400 Bad Request | **VALID** | Ngăn chặn gán giá trị null cho tên. |
| **TC-C16** | Domain (Boundary) | Cập nhật danh mục với tên chỉ chứa khoảng trắng | `PUT /api/categories/:id` body `{"name": "   "}` | 400 Bad Request | **VALID** | Tên cập nhật không được toàn dấu cách. |
| **TC-C17** | Domain (NotFound) | Cập nhật danh mục với ID không tồn tại (`999999`) | `PUT /api/categories/999999` body `{"name": "Không tồn tại"}` | 404 Not Found | **VALID** | Ràng buộc RESTful: tài nguyên không tồn tại phải trả về 404. |
| **TC-C18** | Domain (Invalid) | Cập nhật danh mục với ID không phải số (`abc`) | `PUT /api/categories/abc` body `{"name": "Test"}` | 400 Bad Request | **VALID** | URL param `:id` phải là số nguyên. |
| **TC-C19** | Domain (Invalid) | Cập nhật danh mục với ID là số âm (`-1`) | `PUT /api/categories/-1` body `{"name": "Test"}` | 400 Bad Request hoặc 404 Not Found | **VALID** | ID không thể là số âm. |
| **TC-C20** | Domain (NotFound) | Xóa danh mục với ID không tồn tại (`999999`) | `DELETE /api/categories/999999` | 404 Not Found | **VALID** | Xóa tài nguyên không tồn tại phải trả về 404. |
| **TC-C21** | Domain (Invalid) | Xóa danh mục với ID không phải số (`xyz`) | `DELETE /api/categories/xyz` | 400 Bad Request | **VALID** | ID không hợp lệ trong URL path. |
| **TC-C22** | Domain (Invalid) | Xóa danh mục với ID là số âm (`-1`) | `DELETE /api/categories/-1` | 400 Bad Request hoặc 404 Not Found | **VALID** | ID âm không hợp lệ. |
| **TC-C23** | State (Lifecycle) | Chu kỳ CRUD Bước 1: Admin tạo mới danh mục | `POST /api/categories` body `{"name": "Thiết bị âm thanh"}` | 200 OK, lưu lại `createdCatId` | **VALID** | Bắt đầu vòng đời tài nguyên. |
| **TC-C24** | State (Lifecycle) | Chu kỳ CRUD Bước 2: Đọc danh sách xác minh danh mục mới có mặt | `GET /api/categories` | 200 OK, mảng chứa danh mục có ID = `createdCatId` | **VALID** | Kiểm tra tính bền vững của thao tác ghi. |
| **TC-C25** | State (Lifecycle) | Chu kỳ CRUD Bước 3: Cập nhật tên danh mục vừa tạo | `PUT /api/categories/:createdCatId` body `{"name": "Thiết bị âm thanh Pro"}` | 200 OK, `message: "Category updated"` | **VALID** | Thao tác cập nhật trạng thái. |
| **TC-C26** | State (Lifecycle) | Chu kỳ CRUD Bước 4: Đọc lại danh sách xác minh tên đã đổi | `GET /api/categories` | 200 OK, danh mục mang tên "Thiết bị âm thanh Pro" | **VALID** | Kiểm tra tính nhất quán sau update. |
| **TC-C27** | State (Lifecycle) | Chu kỳ CRUD Bước 5: Xóa danh mục vừa tạo | `DELETE /api/categories/:createdCatId` | 200 OK, `message: "Category deleted"` | **VALID** | Thao tác xóa tài nguyên. |
| **TC-C28** | State (Lifecycle) | Chu kỳ CRUD Bước 6: Đọc lại danh sách xác minh danh mục đã biến mất | `GET /api/categories` | 200 OK, danh mục không còn xuất hiện trong mảng | **VALID** | Đảm bảo tài nguyên bị xóa hoàn toàn khỏi DB. |
| **TC-C29** | Security (SEC-03) | BFLA Check: User thường gọi `POST /api/categories` | Header `Authorization: Bearer {{userToken}}` | 403 Forbidden ("Yêu cầu quyền Admin") | **VALID** | Ràng buộc nghiêm ngặt FR-12 & SEC-03: Phân hệ Admin chỉ dành cho Admin. |
| **TC-C30** | Security (SEC-03) | BFLA Check: User thường gọi `PUT /api/categories/:id` | Header `Authorization: Bearer {{userToken}}` | 403 Forbidden | **VALID** | Ngăn chặn user thường sửa đổi dữ liệu quản trị. |
| **TC-C31** | Security (SEC-03) | BFLA Check: User thường gọi `DELETE /api/categories/:id` | Header `Authorization: Bearer {{userToken}}` | 403 Forbidden | **VALID** | Ngăn chặn user thường xóa danh mục hệ thống. |
| **TC-C32** | Security (SEC-02) | Unauthenticated: Gọi `POST /api/categories` không truyền token | Không có Authorization header | 401 Unauthorized | **VALID** | Bắt buộc xác thực theo SEC-02. |
| **TC-C33** | Security (SEC-02) | Unauthenticated: Gọi `PUT /api/categories/:id` không truyền token | Không có Authorization header | 401 Unauthorized | **VALID** | Bắt buộc xác thực theo SEC-02. |
| **TC-C34** | Security (SEC-02) | Unauthenticated: Gọi `DELETE /api/categories/:id` không truyền token | Không có Authorization header | 401 Unauthorized | **VALID** | Bắt buộc xác thực theo SEC-02. |
| **TC-C35** | Security (SEC-04) | Stored XSS Script Payload trong trường `name` | `POST /api/categories` body `{"name": "<script>alert('XSS')</script>"}` | Dữ liệu được sanitize/escape an toàn | **VALID** | Tuân thủ yêu cầu SEC-04: chống XSS lưu trữ. |
| **TC-C36** | Security (SEC-05) | SQL Injection trong trường `name` (`' OR '1'='1`) | `POST /api/categories` body `{"name": "' OR '1'='1"}` | Được xử lý bằng Parameterized query an toàn | **VALID** | Kiểm tra phòng thủ SQLi theo SEC-05. |
| **TC-C37** | Security (SEC-05) | SQL Injection trong URL Path Parameter `:id` | `DELETE /api/categories/1 OR 1=1` | 400 Bad Request hoặc từ chối an toàn, không xóa toàn bộ bảng | **VALID** | Ngăn ngừa SQLi trong URL path. |
| **TC-C38** | Schema (Category) | Kiểm định Schema chi tiết của danh sách categories | `GET /api/categories` | Mỗi phần tử trong mảng có đúng `{id: number, name: string}` | **VALID** | Khớp 100% schema mục 3.4 đặc tả API. |

---

## 3.2. Các Ca Kiểm Thử Mở Rộng Do Con Người Thiết Kế (Human Extensions)

Dưới đây là **6 ca kiểm thử chuyên sâu** do con người bổ sung mà AI ban đầu bỏ sót:

| Test ID | Tên ca kiểm thử mở rộng | Request Body / Kịch bản thực thi | Kết quả mong đợi theo Đặc tả | Lý do AI bỏ sót (Why AI Missed It) |
| :--- | :--- | :--- | :--- | :--- |
| **TC-EXT-14** | Kiểm tra toàn vẹn quan hệ (Referential Integrity Check): Xóa danh mục đang chứa sản phẩm | Gọi `DELETE /api/categories/1` (Danh mục "Điện thoại" đang chứa iPhone 15, Galaxy S24) | 400 Bad Request hoặc 409 Conflict ("Không thể xóa danh mục đang có sản phẩm liên kết"). | **AI bỏ sót ràng buộc toàn vẹn cơ sở dữ liệu (Foreign Key Constraints):** AI chỉ kiểm thử xóa danh mục rỗng tự tạo, không kiểm thử tác động dây chuyền lên bảng `products`. |
| **TC-EXT-15** | Trùng lặp tên danh mục (Duplicate Category Name Handling) | Tạo 2 danh mục cùng mang tên "Điện thoại thông minh" | Hệ thống từ chối hoặc cảnh báo trùng lặp, không tạo danh mục trùng tên gây phân mảnh dữ liệu. | **AI thiếu tư duy nghiệp vụ thương mại:** AI chỉ kiểm tra cú pháp tên hợp lệ, bỏ qua tính duy nhất (Uniqueness business rule) của tên danh mục sản phẩm. |
| **TC-EXT-16** | Kiểm tra Stored XSS khi đọc lại danh mục (GET Sanitization Verification) | Tạo danh mục chứa `<img src=x onerror=alert('XSS')>` $\rightarrow$ Gọi `GET /api/categories` kiểm tra chuỗi trả về | Chuỗi trong JSON phản hồi phải được escape hoặc sanitize an toàn trước khi trả về client. | **AI thiếu kiểm thử vòng đời hiển thị:** AI chỉ gửi payload vào POST mà không kiểm tra quá trình parse và render ở endpoint GET. |
| **TC-EXT-17** | Phòng thủ Malformed JSON trong POST Category | Gửi chuỗi body lỗi cú pháp: `{name: "Danh mục lỗi"` | 400 Bad Request an toàn, không gây crash server hay lộ stack trace. | **AI luôn mặc định dữ liệu đầu vào có format hoàn hảo.** |
| **TC-EXT-18** | Path Traversal / URL Encoded Parameter Injection trên `:id` | Gọi `DELETE /api/categories/%2e%2e%2f` hoặc `/api/categories/..` | 400 Bad Request hoặc 404 Not Found, ngăn ngừa điều hướng thư mục. | **AI chỉ kiểm tra các giá trị số cơ bản cho tham số đường dẫn.** |
| **TC-EXT-19** | Phân biệt hoa thường khi kiểm tra trùng tên danh mục (Case-Insensitive Uniqueness) | Danh mục "Laptop" đã tồn tại $\rightarrow$ Tạo mới "laptop" | Hệ thống xử lý thông minh để tránh trùng lặp do khác biệt chữ hoa chữ thường. | **AI bỏ qua vấn đề Collation và Encoding trong cơ sở dữ liệu.** |

---

## 3.3. Tổng Kết Số Lượng Ca Kiểm Thử API 3:
- **Số ca kiểm thử do AI sinh ra:** 38 ca kiểm thử
- **Số ca kiểm thử được thẩm định:** 38 ca kiểm thử (38 VALID)
- **Số ca kiểm thử mở rộng bởi con người:** 6 ca kiểm thử
- **Tổng số ca kiểm thử thực thi cho API 3:** **44 ca kiểm thử**

---

# 4. Bảng Tổng Hợp Số Lượng Ca Kiểm Thử Toàn Bộ Đồ Án (HW06 Test Suite)

| Phân hệ / API | Endpoint chính | AI-Generated | Human Audit (Passed/Adjusted) | Human Extensions | Tổng ca kiểm thử thực tế |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **API 1 (Pool A - FR-02)** | `POST /api/login` | 38 | 38 (36 V / 2 I) | 6 | **44** |
| **API 2 (Pool B - FR-08)** | `POST /api/checkout` | 36 | 36 (34 V / 2 I) | 7 | **43** |
| **API 3 (Pool C - FR-14)** | `GET/POST/PUT/DELETE /api/categories` | 38 | 38 (38 V / 0 I) | 6 | **44** |
| **TỔNG CỘNG TEST SUITE** | **3 Phân hệ hoàn chỉnh** | **112** | **112 (108 V / 4 I)** | **19** | **131** |



