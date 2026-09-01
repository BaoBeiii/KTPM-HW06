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
