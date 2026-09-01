const fs = require('fs');
const path = require('path');

const issuesDir = path.resolve(__dirname, '../issues');
if (!fs.existsSync(issuesDir)) {
  fs.mkdirSync(issuesDir, { recursive: true });
}

const bugs = [
  {
    id: "BUG-01",
    file: "ISSUE-01-BUG-01-login-attempts-increment.md",
    title: "[BUG][Major][FR-02] Bộ đếm số lần đăng nhập sai tăng sai bước nhảy (+2 thay vì +1)",
    api: "POST /api/login",
    severity: "Major",
    labels: ["bug", "backend", "authentication", "p2-major"],
    desc: "Theo đặc tả FR-02, sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị và chỉ khóa tài khoản khi đăng nhập sai từ 3 lần trở lên liên tiếp. Tuy nhiên, trong thực tế, ngay sau lần đăng nhập sai thứ 2, tài khoản đã bị khóa ngay lập tức.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 54: `const newAttempts = user.login_attempts + 2;` thay vì `+ 1`.",
    steps: [
      "Gửi request POST /api/login với email hợp lệ và mật khẩu sai lần 1 -> 401 Unauthorized.",
      "Gửi request POST /api/login với mật khẩu sai lần 2 -> 401 Unauthorized.",
      "Gửi request POST /api/login lần 3 với mật khẩu đúng -> Bị từ chối với 403 Forbidden (báo tài khoản đã bị khóa)."
    ],
    actual: "Tài khoản bị khóa chỉ sau 2 lần nhập sai vì bộ đếm nhảy từ 0 -> 2 -> 4 (>= 3).",
    expected: "Phải cho phép người dùng thử sai tối đa 3 lần, lần thứ 4 mới kích hoạt trạng thái khóa.",
    diff: `- const newAttempts = user.login_attempts + 2;\n+ const newAttempts = (user.login_attempts || 0) + 1;`
  },
  {
    id: "BUG-02",
    file: "ISSUE-02-BUG-02-lockout-duration-misconfiguration.md",
    title: "[BUG][Medium][FR-02] Thời gian khóa tài khoản bị cấu hình sai (180 giây thay vì 30 giây)",
    api: "POST /api/login",
    severity: "Medium",
    labels: ["bug", "backend", "configuration", "p3-medium"],
    desc: "Đặc tả FR-02 quy định: 'Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)'. Tuy nhiên, hệ thống thực tế khóa tài khoản trong 180 giây (3 phút).",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 57: `lockedUntil = new Date(Date.now() + 180000).toISOString();` (180,000 ms = 180s thay vì 30,000 ms = 30s).",
    steps: [
      "Thực hiện đăng nhập sai để kích hoạt khóa tài khoản.",
      "Đợi 31 giây (vượt qua mốc 30 giây theo đặc tả demo).",
      "Thử đăng nhập lại bằng mật khẩu đúng -> Vẫn bị từ chối với 403 Forbidden."
    ],
    actual: "Tài khoản bị khóa trong 180 giây.",
    expected: "Sau đúng 30 giây, tài khoản phải tự động mở khóa và cho phép đăng nhập lại bình thường.",
    diff: `- lockedUntil = new Date(Date.now() + 180000).toISOString();\n+ lockedUntil = new Date(Date.now() + 30000).toISOString();`
  },
  {
    id: "BUG-03",
    file: "ISSUE-03-BUG-03-plaintext-password-leak.md",
    title: "[BUG][Critical][SEC-01] Vi phạm bảo mật nghiêm trọng SEC-01 — Để lộ Plaintext Password trong API Login",
    api: "POST /api/login",
    severity: "Critical",
    labels: ["bug", "security", "vulnerability", "p1-critical"],
    desc: "Theo yêu cầu bảo mật SEC-01 và mục 1.2 đặc tả API, thông tin người dùng trả về chỉ gồm id, name, email, role, tuyệt đối không để lộ mật khẩu. Tuy nhiên, endpoint POST /api/login lại trả về nguyên văn mật khẩu plaintext trong thuộc tính user.password của response body JSON.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 35 & 52: Truy vấn `SELECT * FROM users` và truyền nguyên vẹn đối tượng `user` vào JSON response mà không loại bỏ trường `password`.",
    steps: [
      "Gửi request POST /api/login với body: {\"email\": \"test@eshop.com\", \"password\": \"Test1234!\"}.",
      "Quan sát response body JSON nhận được: trường `user.password` chứa 'Test1234!'."
    ],
    actual: "Mật khẩu plaintext của người dùng bị rò rỉ trong JSON response (CWE-200: Exposure of Sensitive Information).",
    expected: "Mật khẩu phải bị loại bỏ hoàn toàn khỏi đối tượng user trước khi phản hồi về client (`delete safeUser.password`).",
    diff: `- res.json({ message: "Login successful", token, user });\n+ const { password, reset_token, ...safeUser } = user;\n+ res.json({ message: "Login successful", token, user: safeUser });`
  },
  {
    id: "BUG-04",
    file: "ISSUE-04-BUG-04-case-sensitive-email.md",
    title: "[BUG][Medium][FR-02] Email trong API Login phân biệt hoa/thường sai chuẩn RFC (Case-sensitive email login)",
    api: "POST /api/login",
    severity: "Medium",
    labels: ["bug", "backend", "rfc-compliance", "p3-medium"],
    desc: "Theo chuẩn RFC 5321 và thực tiễn thiết kế hệ thống xác thực hiện đại, địa chỉ email không phân biệt chữ hoa chữ thường (case-insensitive). Người dùng đăng ký 'test@eshop.com' phải có thể đăng nhập bằng 'TEST@ESHOP.COM'. Tuy nhiên SUT phân biệt hoa thường chặt chẽ và từ chối đăng nhập.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 35: Truy vấn `SELECT * FROM users WHERE email = ?` so khớp trực tiếp chuỗi chữ hoa mà không chuẩn hóa `LOWER(email) = LOWER(?)`.",
    steps: [
      "Tài khoản đăng ký trong hệ thống: `test@eshop.com`.",
      "Gửi request POST /api/login với `{\"email\": \"TEST@ESHOP.COM\", \"password\": \"Test1234!\"}`."
    ],
    actual: "Server trả về 401 Unauthorized ('Tài khoản không tồn tại').",
    expected: "Đăng nhập thành công với 200 OK vì email không phân biệt chữ hoa chữ thường.",
    diff: `- db.get("SELECT * FROM users WHERE email = ?", [email], ...)\n+ db.get("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email], ...)`
  },
  {
    id: "BUG-05",
    file: "ISSUE-05-BUG-05-price-tampering.md",
    title: "[BUG][Critical][FR-08] Lỗ hổng Price Tampering nghiêm trọng — Backend tin tưởng giá trị total_amount gửi lên từ Client",
    api: "POST /api/checkout",
    severity: "Critical",
    labels: ["bug", "security", "business-logic", "p1-critical"],
    desc: "Theo đặc tả nghiệp vụ FR-08, tổng số tiền thanh toán bắt buộc phải được tính toán tự động ở phía backend dựa trên giá niêm yết của các sản phẩm có trong giỏ hàng (`userCarts[userId]`) và mã giảm giá hợp lệ. Tuy nhiên, endpoint POST /api/checkout lại lấy trực tiếp trường `total_amount` do client gửi lên trong request body để lưu vào cơ sở dữ liệu orders mà không hề kiểm tra hay tính toán lại.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 297-309: Lấy trực tiếp `const { total_amount, shipping_address } = req.body;` và chèn vào bảng orders.",
    steps: [
      "Thêm sản phẩm có giá trị 30,000,000 VND vào giỏ hàng.",
      "Gửi request POST /api/checkout với body: `{\"total_amount\": 1000, \"shipping_address\": \"123 Le Loi\"}` hoặc `{\"total_amount\": 0, ...}`."
    ],
    actual: "Server trả về 200 OK và tạo đơn hàng với tổng tiền chỉ 1,000 VND (hoặc 0 VND), gây thất thoát tài chính nghiêm trọng.",
    expected: "Backend phải từ chối đơn hàng sai lệch giá (400 Bad Request) hoặc tự động tính toán lại tổng tiền từ giỏ hàng thực tế.",
    diff: `- const { total_amount, shipping_address } = req.body;\n+ const cart = userCarts[userId] || [];\n+ // Tính toán lại server-side total từ cơ sở dữ liệu products`
  },
  {
    id: "BUG-06",
    file: "ISSUE-06-BUG-06-cart-not-cleared.md",
    title: "[BUG][Major][FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công",
    api: "POST /api/checkout",
    severity: "Major",
    labels: ["bug", "backend", "state-management", "p2-major"],
    desc: "Đặc tả FR-08 quy định rõ: 'Sau khi thanh toán thành công, giỏ hàng được làm rỗng'. Tuy nhiên, sau khi gọi POST /api/checkout thành công, giỏ hàng của người dùng vẫn giữ nguyên toàn bộ sản phẩm cũ.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 297-309: Trong callback thành công của lệnh `INSERT INTO orders`, backend hoàn toàn thiếu dòng lệnh dọn dẹp giỏ hàng: `userCarts[userId] = [];`.",
    steps: [
      "Thêm sản phẩm vào giỏ hàng: POST /api/cart.",
      "Thực hiện thanh toán: POST /api/checkout -> Nhận 200 OK.",
      "Kiểm tra lại giỏ hàng: GET /api/cart."
    ],
    actual: "Giỏ hàng vẫn còn nguyên các sản phẩm đã thanh toán.",
    expected: "GET /api/cart phải trả về mảng rỗng `[]` sau khi đã đặt hàng thành công.",
    diff: `  function (err) {\n    if (err) return res.status(500).json({ error: err.message });\n+   userCarts[userId] = []; // Dọn dẹp giỏ hàng\n    res.json({ message: "Checkout successful", orderId: this.lastID });\n  }`
  },
  {
    id: "BUG-07",
    file: "ISSUE-07-BUG-07-empty-cart-checkout.md",
    title: "[BUG][Major][FR-08] Cho phép tạo đơn hàng khi giỏ hàng rỗng",
    api: "POST /api/checkout",
    severity: "Major",
    labels: ["bug", "backend", "business-logic", "p2-major"],
    desc: "Theo quy trình nghiệp vụ mua sắm trực tuyến, người dùng không thể thanh toán đơn hàng khi giỏ hàng chưa có bất kỳ sản phẩm nào. Tuy nhiên, SUT cho phép gọi checkout và tạo đơn hàng thành công ngay cả khi `userCarts[userId]` rỗng hoặc chưa từng được khởi tạo.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 297-309: Endpoint không kiểm tra giỏ hàng của user hiện tại trước khi tạo bản ghi đơn hàng.",
    steps: [
      "Người dùng mới đăng ký, giỏ hàng hoàn toàn rỗng.",
      "Gửi request POST /api/checkout với body: `{\"total_amount\": 200000, \"shipping_address\": \"123 Le Loi\"}`."
    ],
    actual: "Server trả về 200 OK và tạo một đơn hàng rỗng trong CSDL.",
    expected: "Server phải từ chối yêu cầu và trả về 400 Bad Request ('Giỏ hàng rỗng, không thể thanh toán').",
    diff: `+ if (!userCarts[userId] || userCarts[userId].length === 0) {\n+   return res.status(400).json({ error: "Giỏ hàng của bạn đang trống" });\n+ }`
  },
  {
    id: "BUG-08",
    file: "ISSUE-08-BUG-08-missing-input-validation-checkout.md",
    title: "[BUG][Major][FR-08] Thiếu hoàn toàn Validation dữ liệu đầu vào trên Endpoint Checkout",
    api: "POST /api/checkout",
    severity: "Major",
    labels: ["bug", "backend", "input-validation", "p2-major"],
    desc: "Endpoint /api/checkout không thực hiện bất kỳ kiểm tra hợp lệ nào đối với các trường trong request body. Hệ thống chấp nhận: `total_amount` âm (-50,000), bằng 0, null, boolean, chuỗi chữ; `shipping_address` rỗng, null, khoảng trắng, kiểu số; và body rỗng `{}`.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 297-309: Không có middleware kiểm tra tính hợp lệ của tham số.",
    steps: [
      "Gửi request POST /api/checkout với `{\"total_amount\": -50000, \"shipping_address\": \"\"}`."
    ],
    actual: "Server trả về 200 OK và ghi nhận đơn hàng giá tiền âm với địa chỉ giao hàng rỗng.",
    expected: "Server phải trả về 400 Bad Request với thông báo lỗi rõ ràng.",
    diff: `+ if (typeof total_amount !== 'number' || total_amount <= 0) {\n+   return res.status(400).json({ error: "total_amount phải là số nguyên dương" });\n+ }\n+ if (!shipping_address || typeof shipping_address !== 'string' || !shipping_address.trim()) {\n+   return res.status(400).json({ error: "shipping_address không được để trống" });\n+ }`
  },
  {
    id: "BUG-09",
    file: "ISSUE-09-BUG-09-concurrency-overselling-stock.md",
    title: "[BUG][Major][FR-08] Lỗ hổng Overselling & Tồn kho âm khi kiểm thử tương tranh (Concurrency Race Condition)",
    api: "POST /api/checkout",
    severity: "Major",
    labels: ["bug", "concurrency", "inventory", "p2-major"],
    desc: "Khi một sản phẩm chỉ còn số lượng bằng 1 và có 2 người dùng (User 1 và User 2) cùng đưa sản phẩm đó vào giỏ hàng và đồng thời thực hiện thanh toán, hệ thống không có cơ chế khóa tương tranh (Locking) hay Transaction cô lập. Cả 2 người đều thanh toán thành công 200 OK và được cấp 2 orderId riêng biệt, dẫn tới việc bán vượt tồn kho (Overselling) và tồn kho bị giảm về âm.",
    rootCause: "File `eshop-sut/backend/database.js` thiếu cột `stock` trong bảng products, và `server.js` dòng 297-309 chỉ `INSERT INTO orders` mà không hề có truy vấn kiểm tra tồn kho bằng cơ chế giao dịch khóa hàng.",
    steps: [
      "User 1 và User 2 cùng thêm 1 sản phẩm cuối cùng vào giỏ hàng.",
      "User 1 và User 2 đồng thời gửi request POST /api/checkout."
    ],
    actual: "Cả 2 request đều trả về 200 OK, đơn hàng được tạo cho cả 2 người mua món hàng duy nhất.",
    expected: "Chỉ người thanh toán trước được 200 OK; người thứ hai phải nhận 400 Bad Request ('Sản phẩm đã hết hàng / Out of stock'); số lượng tồn kho không được âm.",
    diff: `+ // Bổ sung kiểm tra số lượng tồn kho và atomic decrement transaction trong CSDL`
  },
  {
    id: "BUG-10",
    file: "ISSUE-10-BUG-10-bfla-category-crud.md",
    title: "[BUG][Critical][FR-14][SEC-03] Lỗ hổng Phân quyền Broken Function Level Authorization (BFLA) trên các Endpoint Quản lý Danh mục",
    api: "POST/PUT/DELETE /api/categories",
    severity: "Critical",
    labels: ["bug", "security", "bfla", "owasp-top-10", "p1-critical"],
    desc: "Theo đặc tả phân hệ Admin (FR-12 & SEC-03), các tác vụ thêm, sửa, xóa danh mục chỉ được phép thực hiện bởi tài khoản Quản trị viên (role === 'admin'). Tuy nhiên, trên hệ thống SUT, bất kỳ người dùng thông thường nào (role: 'user') chỉ cần có token hợp lệ đều có thể tạo mới, cập nhật tên hoặc xóa sạch các danh mục của hệ thống.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 249, 257, 269: Chỉ sử dụng middleware `authenticateToken` để kiểm tra JWT hợp lệ mà hoàn toàn thiếu bước kiểm tra `req.user.role === 'admin'`.",
    steps: [
      "Đăng nhập tài khoản người dùng thường: test@eshop.com.",
      "Gửi request POST /api/categories với Authorization: Bearer <userToken> và body `{\"name\": \"Hacked Category\"}`.",
      "Gửi request DELETE /api/categories/3 với Authorization: Bearer <userToken>."
    ],
    actual: "Server trả về 200 OK cho cả thao tác tạo và xóa danh mục bởi người dùng thông thường.",
    expected: "Server phải từ chối truy cập và trả về HTTP 403 Forbidden ('Yêu cầu quyền Quản trị viên').",
    diff: `+ const requireAdmin = (req, res, next) => {\n+   if (req.user && req.user.role === 'admin') return next();\n+   return res.status(403).json({ error: "Yêu cầu quyền Quản trị viên" });\n+ };\n- app.post("/api/categories", authenticateToken, ...)\n+ app.post("/api/categories", authenticateToken, requireAdmin, ...)`
  },
  {
    id: "BUG-11",
    file: "ISSUE-11-BUG-11-missing-input-validation-category.md",
    title: "[BUG][Major][FR-14] Thiếu hoàn toàn Validation Dữ liệu Tên Danh mục trên POST và PUT /api/categories",
    api: "POST /api/categories, PUT /api/categories/:id",
    severity: "Major",
    labels: ["bug", "backend", "input-validation", "p2-major"],
    desc: "Hệ thống không kiểm tra tính hợp lệ của trường `name` khi tạo hoặc cập nhật danh mục: chấp nhận chuỗi rỗng \"\", null, khoảng trắng \"   \", body rỗng {}, hoặc kiểu số 12345.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 249-267: Biến `{ name } = req.body` được truyền trực tiếp vào câu lệnh SQL INSERT/UPDATE mà không qua bất kỳ câu lệnh validate nào.",
    steps: [
      "Đăng nhập tài khoản Admin.",
      "Gửi request POST /api/categories với body `{\"name\": \"\"}` hoặc `{\"name\": null}`."
    ],
    actual: "Server trả về 200 OK và lưu một dòng có tên rỗng/null vào CSDL.",
    expected: "Server phải trả về 400 Bad Request với thông báo 'Tên danh mục không được để trống'.",
    diff: `+ if (!name || typeof name !== 'string' || !name.trim()) {\n+   return res.status(400).json({ error: "Tên danh mục không được để trống" });\n+ }`
  },
  {
    id: "BUG-12",
    file: "ISSUE-12-BUG-12-restful-404-category.md",
    title: "[BUG][Medium][FR-14] Vi phạm Chuẩn RESTful — Endpoint PUT và DELETE luôn trả về 200 OK khi ID Danh mục không tồn tại",
    api: "PUT /api/categories/:id, DELETE /api/categories/:id",
    severity: "Medium",
    labels: ["bug", "backend", "restful-standards", "p3-medium"],
    desc: "Khi client gửi request cập nhật hoặc xóa một danh mục với ID không hề tồn tại trong cơ sở dữ liệu (ví dụ: id = 999999), server vẫn trả về HTTP 200 OK với thông báo 'Category updated' hoặc 'Category deleted'. Điều này vi phạm nguyên tắc thiết kế RESTful API.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 263, 274: Trong callback của `db.run`, mã nguồn không kiểm tra thuộc tính `this.changes`. Khi `this.changes === 0`, server vẫn mặc định gửi `res.json(...)` thay vì trả về 404.",
    steps: [
      "Gửi request DELETE /api/categories/999999 với token hợp lệ.",
      "Gửi request PUT /api/categories/999999 với `{\"name\": \"Non-existent\"}`."
    ],
    actual: "Server trả về 200 OK cho cả 2 thao tác trên ID không tồn tại.",
    expected: "Server phải trả về 404 Not Found kèm thông báo 'Danh mục không tồn tại'.",
    diff: `  function (err) {\n    if (err) return res.status(500).json({ error: err.message });\n+   if (this.changes === 0) return res.status(404).json({ error: "Danh mục không tồn tại" });\n    res.json({ message: "Category deleted" });\n  }`
  },
  {
    id: "BUG-13",
    file: "ISSUE-13-BUG-13-referential-integrity-category.md",
    title: "[BUG][Major][FR-14] Vi phạm Tính Toàn Vẹn Quan Hệ (Referential Integrity) khi Xóa Danh mục Đang Chứa Sản phẩm",
    api: "DELETE /api/categories/:id",
    severity: "Major",
    labels: ["bug", "database", "referential-integrity", "p2-major"],
    desc: "Hệ thống cho phép xóa trực tiếp danh mục (ví dụ ID 1 'Điện thoại') trong khi vẫn còn nhiều sản phẩm trong bảng products đang liên kết với danh mục này (category_id = 1). Sau khi xóa, các sản phẩm này vẫn tồn tại nhưng trỏ vào một category_id không còn tồn tại, tạo ra các bản ghi mồ côi (Orphaned Records) trong CSDL.",
    rootCause: "File `eshop-sut/backend/server.js`, dòng 269-278: Endpoint không thực hiện truy vấn `SELECT COUNT(*) FROM products WHERE category_id = ?` trước khi xóa.",
    steps: [
      "Gửi request DELETE /api/categories/1.",
      "Gửi request GET /api/products kiểm tra các sản phẩm có category_id = 1."
    ],
    actual: "Danh mục 1 bị xóa thành công (200 OK), các sản phẩm vẫn trỏ vào category_id = 1 nhưng danh mục đã biến mất.",
    expected: "Server phải từ chối xóa và trả về 400 Bad Request hoặc 409 Conflict ('Không thể xóa danh mục đang có sản phẩm liên kết').",
    diff: `+ db.get("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [req.params.id], (err, row) => {\n+   if (row && row.count > 0) return res.status(409).json({ error: "Không thể xóa danh mục đang chứa sản phẩm liên kết" });\n+   // Tiếp tục xóa nếu count === 0\n+ });`
  }
];

bugs.forEach(bug => {
  const content = `---
title: "${bug.title}"
labels: ${JSON.stringify(bug.labels)}
assignees: ["BaoBeiii"]
---

# ${bug.title}

## 1. Thông Tin Chung (Metadata)
- **Mã lỗi (Bug ID):** \`${bug.id}\`
- **Người báo cáo:** Lưu Ngô Quốc Bảo (MSSV: \`23127327\`)
- **API bị ảnh hưởng:** \`${bug.api}\`
- **Mức độ nghiêm trọng (Severity):** \`${bug.severity}\`
- **Môi trường phát hiện:** Node.js v24.11.0, Express.js Backend, SQLite3, Newman v6.2.1

---

## 2. Mô Tả Lỗi (Bug Description)
${bug.desc}

---

## 3. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
${bug.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## 4. Kết Quả Thực Tế (Actual Result)
${bug.actual}

---

## 5. Kết Quả Mong Đợi Theo Đặc Tả (Expected Result)
${bug.expected}

---

## 6. Phân Tích Nguyên Nhân Kỹ Thuật (Root Cause Analysis)
- **Vị trí mã nguồn lỗi:** ${bug.rootCause}

---

## 7. Đề Xuất Khắc Phục (Proposed Fix & Code Diff)
\`\`\`diff
${bug.diff}
\`\`\`
`;

  fs.writeFileSync(path.join(issuesDir, bug.file), content, 'utf8');
  console.log(`Generated: ${bug.file}`);
});

// Generate issues/README.md
let readmeContent = `# Danh Sách GitHub Issues — Báo Cáo Lỗi Hệ Thống EShop API

- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: \`23127327\`)
- **Đồ án:** Kiểm thử phần mềm (HW06)
- **Tổng số lỗi hệ thống được xác nhận:** 13 lỗi (3 Critical, 7 Major, 3 Medium)

---

## Bảng Tổng Hợp 13 GitHub Issues Đã Tạo

| Issue ID | Mã Lỗi | Tiêu Đề GitHub Issue | API Bị Ảnh Hưởng | Mức Độ (Severity) | Nhãn (Labels) | Tệp Chi Tiết |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
`;

bugs.forEach((b, idx) => {
  readmeContent += `| #${idx + 1} | \`${b.id}\` | [${b.title}](./${b.file}) | \`${b.api}\` | **${b.severity}** | \`${b.labels.join(', ')}\` | [\`${b.file}\`](./${b.file}) |\n`;
});

readmeContent += `
---

## Hướng Dẫn Sử Dụng
Các tệp báo cáo lỗi trong thư mục này được định dạng theo đúng chuẩn GitHub Issue Template (\`.github/ISSUE_TEMPLATE/bug_report.md\`). Có thể đẩy trực tiếp lên GitHub Repository thông qua GitHub CLI (\`gh issue create\`) hoặc thông qua giao diện Web của GitHub.
`;

fs.writeFileSync(path.join(issuesDir, 'README.md'), readmeContent, 'utf8');
console.log('Generated issues/README.md successfully!');
