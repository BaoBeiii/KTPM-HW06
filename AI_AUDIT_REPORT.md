# BÁO CÁO TỔNG HỢP KIỂM TOÁN TƯƠNG TÁC AI (MASTER AI AUDIT REPORT)

- **Mã môn học / Bài tập:** Kiểm thử phần mềm — HW06 (API Testing)
- **Mã số sinh viên:** `23127327`
- **Họ và tên sinh viên:** `Lưu Ngô Quốc Bảo`
- **Công cụ AI sử dụng:** Google Antigravity IDE (Mô hình nền tảng: Gemini 3.7 Flash)
- **Thời gian thực hiện:** Từ 22:30 ngày 31/08/2026 đến 14:30 ngày 01/09/2026 (GMT+7)
- **Kho lưu trữ GitHub:** [https://github.com/BaoBeiii/KTPM-HW06](https://github.com/BaoBeiii/KTPM-HW06)
- **Thư mục nhật ký chi tiết thành phần:** [`ai-audit/`](./ai-audit/)

---

## MỤC LỤC TỔNG QUAN CÁC PHIÊN KIỂM TOÁN

| Phiên # | Giai Đoạn Dự Án | Mục Tiêu Kỹ Thuật | Số Khúc Sửa | Mức Bloom-AI | Tệp Nhật Ký Thành Phần |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **000** | **Phase 0: Lập Kế Hoạch & Workflow** | Khảo sát SUT, chọn 3 API, thiết lập Quality Gate & Git policy | **5** | **G9.4 (Collaborate)** | [`ai-audit/000-planning-session.md`](./ai-audit/000-planning-session.md) |
| **001** | **Phase 1: Môi Trường & Anti-Cheat** | Khởi chạy SUT daemon, Newman, tự động nạp X-Student-Id | **4** | **G9.2 (Apply)** | [`ai-audit/001-phase1-setup.md`](./ai-audit/001-phase1-setup.md) |
| **002** | **Phase 2: Đặc Tả & Chiến Lược** | Bóc tách Explicit/Assumptions, ma trận 5 kỹ thuật kiểm thử | **4** | **G9.3 (Analyse)** | [`ai-audit/002-phase2-strategy.md`](./ai-audit/002-phase2-strategy.md) |
| **003** | **Phase 3: API 1 - FR-02 Login** | Sinh 38 tests AI, audit, mở rộng 6 tests, bắt 4 bugs (BUG-01 $\rightarrow$ 04) | **5** | **G9.4 (Collaborate)** | [`ai-audit/api-01/001-fr02-generation-audit.md`](./ai-audit/api-01/001-fr02-generation-audit.md) |
| **004** | **Phase 4: API 2 - FR-08 Checkout** | Sinh 36 tests AI, kiểm thử tương tranh âm kho, 7 extensions, bắt 5 bugs | **5** | **G9.4 (Collaborate)** | [`ai-audit/api-02/001-fr08-generation-audit.md`](./ai-audit/api-02/001-fr08-generation-audit.md) |
| **005** | **Phase 5: API 3 - FR-14 Categories** | Sinh 38 tests AI, kiểm thử BFLA & khóa ngoại, bắt 4 bugs (BUG-10 $\rightarrow$ 13) | **5** | **G9.4 (Collaborate)** | [`ai-audit/api-03/001-fr14-generation-audit.md`](./ai-audit/api-03/001-fr14-generation-audit.md) |
| **006** | **Phase 6: Newman Toàn Hệ Thống** | Hợp nhất 131 tests, reseed DB, chạy Newman toàn cục (179 assertions) | **4** | **G9.2 (Apply)** | [`ai-audit/003-phase6-newman-consolidation.md`](./ai-audit/003-phase6-newman-consolidation.md) |
| **007** | **Phase 7: Lập Hồ Sơ GitHub Issues** | Chuẩn hóa template, lập 13 bug reports độc lập, script xuất bản | **4** | **G9.2 (Apply)** | [`ai-audit/004-phase7-github-issues.md`](./ai-audit/004-phase7-github-issues.md) |
| **008** | **Phase 8: CI/CD GitHub Actions** | Tự động hóa CI/CD, giải quyết sự cố 2 commit đối chứng Pass & Fail | **4** | **G9.4 (Collaborate)** | [`ai-audit/005-phase8-cicd-pipeline.md`](./ai-audit/005-phase8-cicd-pipeline.md) |
| **009** | **Phase 9: Thiết Kế Agent Skill** | Kiến trúc 5 Passes tự vẽ, mã giả thuật toán, CLI generator thực thi | **4** | **G9.5 (Create)** | [`ai-audit/006-phase9-agent-skill.md`](./ai-audit/006-phase9-agent-skill.md) |
| **010** | **Phase 10: Báo Cáo & Phản Biện** | Biên soạn REPORT.md, phản biện AI Critique chuẩn 255 từ, Anti-Cheat | **4** | **G9.3 / G9.4** | [`ai-audit/007-phase10-final-report.md`](./ai-audit/007-phase10-final-report.md) |

---

## CHI TIẾT TỪNG PHIÊN KIỂM TOÁN TƯƠNG TÁC (DETAILED AUDIT RECORDS)

---

### PHIÊN 000: PHÂN TÍCH ĐỀ BÀI & THIẾT LẬP KẾ HOẠCH (PHASE 0)
- **Thời gian:** 2026-08-31T22:30 $\rightarrow$ 2026-09-01T11:45 (GMT+7)
- **Mức Bloom-AI:** **G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Tôi cần lập kế hoạch thực hiện đồ án HW06 - API Testing trên hệ thống EShop SUT theo đúng rubric của giảng viên. Hãy khảo sát kho mã nguồn và đề xuất kế hoạch chi tiết."*
- **Phản hồi ban đầu của AI:** Đưa ra bản kế hoạch 11 phase nhưng tự ý giả định trước mã lỗi và áp đặt làm video YouTube là bắt buộc.

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (5 Khúc Sửa):
1. **Khúc sửa 1 (Loại bỏ phỏng đoán lỗi trước thực nghiệm & YouTube):**
   - *Prompt người dùng:* *"Sửa kế hoạch như này. Mình đã đọc toàn bộ kế hoạch của bạn. Nhìn tổng thể, kế hoạch hiện tại khá tốt về mặt workflow... Tuy nhiên, có một số điểm nguy hiểm: bạn đang xác định trước một số bug, số lượng test, hành vi SUT và cả việc YouTube là điều kiện bắt buộc, trong khi những thứ đó phải được thực nghiệm rồi mới kết luận..."*
   - *Hành động của AI:* Tiếp thu hoàn toàn, gỡ bỏ các kết luận giả định về bug, chuyển chỉ tiêu số lượng sang mức tối thiểu ($\ge 35$ AI tests, $\ge 5$ extensions), chuyển video sang mục khuyến khích mở rộng.
2. **Khúc sửa 2 (Chọn API Pool C):**
   - *Prompt người dùng:* *"sửa kế hoạch Pool C chọn FR-14 đi"*
   - *Hành động của AI:* Đổi Pool C sang FR-14 (Category CRUD), phân tích các endpoint GET/POST/PUT/DELETE `/api/categories`.
3. **Khúc sửa 3 (Cơ chế Quality Gate bắt buộc):**
   - *Prompt người dùng:* *"Thêm vào kế hoạch là mỗi phase phải qua kiểm duyệt của tôi thì mới được qua phase tiếp theo. Nếu tôi không duyệt thì quay lại sửa rồi đợt tôi duyệt lại mới được qua phase kế tiếp"*
   - *Hành động của AI:* Thiết lập 11 Quality Gates, cam kết dừng lại chờ người dùng duyệt qua từng bước.
4. **Khúc sửa 4 (Quy chế Git Commit):**
   - *Prompt người dùng:* *"Thêm kế hoạch về cách commit thì cứ xong 1 phase là 1 commit không cần phải được duyệt mới được commit. Khi có sửa lỗi ở phase đó thì có thêm commit sửa lỗi thôi."*
   - *Hành động của AI:* Chuẩn hóa quy tắc 1 commit/phase, bổ sung commit sửa lỗi độc lập khi có yêu cầu.
5. **Khúc sửa 5 (Định danh sinh viên):**
   - *Prompt người dùng:* *"Mã số sinh viên: 23127327, Họ tên: Lưu Ngô Quốc Bảo"*
   - *Hành động của AI:* Nạp biến định danh sinh viên vào toàn bộ hệ thống kiểm thử.

---

### PHIÊN 001: MÔI TRƯỜNG SUT & POSTMAN FOUNDATION (PHASE 1)
- **Thời gian:** 2026-09-01T11:53 $\rightarrow$ 2026-09-01T11:56 (GMT+7)
- **Mức Bloom-AI:** **G9.2 (Apply)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 1: Thiết lập môi trường chạy SUT, cấu hình Postman collection/environment có header X-Student-Id và chạy thử kết nối."*
- **Phản hồi ban đầu của AI:** Khảo sát thư mục SUT, tạo package.json và Postman collection.

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Đường dẫn Node.js trong Sandbox):** Chuyển sang đường dẫn tuyệt đối `& 'C:\Program Files\nodejs\node.exe'` để vượt qua rào cản sandbox.
2. **Khúc sửa 2 (Chạy Backend dạng Daemon nền):** Cấu hình `IsDaemon: true` kèm vòng lặp kiểm tra sức khỏe `curl http://localhost:3000/api/products` để không block terminal.
3. **Khúc sửa 3 (Tự động nạp Anti-Cheat Header):** Cài Pre-request Script cấp Collection tự động gắn header `X-Student-Id: 23127327` cho 100% request.
4. **Khúc sửa 4 (Xuất bằng chứng chống gian lận):** Chạy Newman xuất console log ra tệp `screenshots/console_evidence_student_id.txt` và báo cáo `reports/healthcheck_report.html`.

---

### PHIÊN 002: PHÂN TÍCH ĐẶC TẢ & CHIẾN LƯỢC KIỂM THỬ (PHASE 2)
- **Thời gian:** 2026-09-01T12:26 $\rightarrow$ 2026-09-01T12:28 (GMT+7)
- **Mức Bloom-AI:** **G9.3 (Analyse)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 2: Phân tích chi tiết tài liệu đặc tả API và xây dựng tài liệu chiến lược kiểm thử toàn diện cho 3 API đã chọn."*
- **Phản hồi ban đầu của AI:** Bóc tách sơ bộ các tham số của 3 API.

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Phân định rạch ròi Explicit / Assumptions / Unknowns):** Tách bạch giữa yêu cầu ghi rõ trong SRS và các giả định chuẩn công nghiệp để tránh ngộ nhận lỗi.
2. **Khúc sửa 2 (Ma trận bảo mật SEC-01 $\rightarrow$ SEC-07):** Ánh xạ điều khoản bảo mật vào từng API (Login: SEC-01, SEC-05; Checkout: SEC-02, Price Tampering; Categories: SEC-03 BFLA).
3. **Khúc sửa 3 (5 kỹ thuật kiểm thử cốt lõi):** Chuẩn hóa tài liệu bao gồm: EP, BVA, State Transition, Security và JSON Schema.
4. **Khúc sửa 4 (Hạn mức ca kiểm thử):** Đặt mục tiêu $\ge 40$ test cases/API, toàn suite $\ge 120$ test cases, cam kết 100% audit.

---

### PHIÊN 003: PIPELINE KIỂM THỬ API 1 - FR-02 LOGIN (PHASE 3)
- **Thời gian:** 2026-09-01T12:46 $\rightarrow$ 2026-09-01T12:53 (GMT+7)
- **Mức Bloom-AI:** **G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 3 cho API 1: FR-02 Đăng nhập (POST /api/login). Áp dụng quy trình AI-First theo 4 kỹ thuật (EP/BVA, State Transition, Security, Schema), thẩm định audit và mở rộng ít nhất 5 test cases."*
- **Phản hồi ban đầu của AI:** Sinh 38 ca kiểm thử sơ bộ (TC-A01 $\rightarrow$ TC-A38).

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (5 Khúc Sửa):
1. **Khúc sửa 1 (Hiệu chỉnh TC-A17):** Bổ sung assertion kiểm tra chống leo thang đặc quyền `pm.expect(data.user.role).to.equal('user')`.
2. **Khúc sửa 2 (Hiệu chỉnh TC-A22):** Kiểm tra cơ chế trim khoảng trắng email thay vì kỳ vọng cứng 200.
3. **Khúc sửa 3 (Mở rộng 6 ca kiểm thử do con người thiết kế):** Bổ sung TC-EXT-01 đến TC-EXT-06 (Email case-insensitive RFC 5321, JWT Base64 verification, Malformed JSON, Timing attack, Unicode email, Hết hạn khóa).
4. **Khúc sửa 4 (Xác nhận 4 bugs thực tế):** Phân tích 4 assertions thất bại trên Newman, soi chiếu vào `server.js` xác nhận: `BUG-01` (bộ đếm tăng +2), `BUG-02` (khóa 180s), `BUG-03` (lộ plaintext password SEC-01), `BUG-04` (email phân biệt hoa thường).
5. **Khúc sửa 5 (Bảo vệ tài khoản Admin):** Chuyển các test case lockout sang email dummy để không khóa tài khoản `admin@eshop.com`.

---

### PHIÊN 004: PIPELINE KIỂM THỬ API 2 - FR-08 CHECKOUT (PHASE 4)
- **Thời gian:** 2026-09-01T13:00 $\rightarrow$ 2026-09-01T13:20 (GMT+7)
- **Mức Bloom-AI:** **G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 4 cho API 2: FR-08 Thanh toán (POST /api/checkout). Cần kiểm thử luồng giỏ hàng liên hoàn, phòng thủ gian lận giá và thẩm định đầy đủ test cases."*
- **Phản hồi ban đầu của AI:** Sinh 36 ca kiểm thử ban đầu (TC-B01 $\rightarrow$ TC-B36).

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (5 Khúc Sửa):
1. **Khúc sửa 1 (Kiểm thử Tương tranh Bán vượt Tồn kho & Âm kho):**
   - *Prompt người dùng (Nguyên văn):* *"checkout thêm tính năng khi số lượng còn 1 cho 2 người thanh toán cùng lúc với sản phẩm đó xem số lượng có bị về âm không"*
   - *Hành động của AI:* Thiết kế **TC-EXT-13**, phát hiện SUT thiếu cột `stock` và không có transaction locking $\rightarrow$ Xác nhận lỗi **BUG-09 (Overselling & Âm kho)**, commit `4db4a6c`.
2. **Khúc sửa 2 (Đồng bộ số lượng 7 ca kiểm do con người mở rộng):**
   - *Prompt người dùng (Nguyên văn):* *"thế thì có 7 ca kiểm do con người làm á quên sửa rồi kìa"*
   - *Hành động của AI:* Rà soát và cập nhật đồng bộ con số 7 human extensions trên toàn bộ tài liệu và commit `4aee754`.
3. **Khúc sửa 3 (Tách biệt kiểm thử tiền thanh toán biên):** Tách TC-B17 (tiền âm) và TC-B18 (tiền bằng 0) để kiểm tra độc lập mã lỗi 400.
4. **Khúc sửa 4 (Bắt lỗi Price Tampering BUG-05):** Gửi đơn hàng 1,000 VND cho giỏ hàng 30 triệu, phát hiện server chấp nhận 200 OK tại dòng 297 của `server.js`.
5. **Khúc sửa 5 (Bền vững trạng thái giỏ hàng):** Thiết lập chuỗi `POST /api/cart` $\rightarrow$ `checkout` $\rightarrow$ `GET /api/cart`, bắt được lỗi giỏ hàng không bị xóa (`BUG-06`) và checkout giỏ hàng rỗng (`BUG-07`).

---

### PHIÊN 005: PIPELINE KIỂM THỬ API 3 - FR-14 CATEGORIES (PHASE 5)
- **Thời gian:** 2026-09-01T13:28 $\rightarrow$ 2026-09-01T13:38 (GMT+7)
- **Mức Bloom-AI:** **G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 5 cho API 3: FR-14 Quản lý Danh mục (CRUD /api/categories). Đảm bảo kiểm thử đủ 4 phương thức GET/POST/PUT/DELETE, kiểm tra chặt chẽ phân quyền Admin và toàn vẹn cơ sở dữ liệu."*
- **Phản hồi ban đầu của AI:** Sinh 38 ca kiểm thử cơ bản (TC-C01 $\rightarrow$ TC-C38).

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (5 Khúc Sửa):
1. **Khúc sửa 1 (Kiểm thử Phân quyền BFLA - SEC-03):** Dùng token người dùng thường gọi POST/PUT/DELETE danh mục, phát hiện server trả về 200 OK do thiếu kiểm tra `req.user.role === 'admin'` $\rightarrow$ Xác nhận **BUG-10 (BFLA)**.
2. **Khúc sửa 2 (Kiểm thử Toàn vẹn Dữ liệu Quan hệ):** Xóa danh mục ID 1 đang chứa sản phẩm, phát hiện server xóa thành công để lại sản phẩm mồ côi $\rightarrow$ Xác nhận **BUG-13 (Referential Integrity Violation)**.
3. **Khúc sửa 3 (Chuẩn RESTful khi ID không tồn tại):** Gửi PUT/DELETE ID 999999, server trả về 200 OK thay vì 404 do thiếu kiểm tra `this.changes === 0` $\rightarrow$ Xác nhận **BUG-12**.
4. **Khúc sửa 4 (Validation tên danh mục):** Gửi tên rỗng `""`, null, khoảng trắng, server chấp nhận lưu vào CSDL $\rightarrow$ Xác nhận **BUG-11**.
5. **Khúc sửa 5 (Vòng đời FSM Chaining):** Cấu hình Postman lưu `tempCatId` từ phản hồi POST để tự động truyền vào URL của PUT, GET và DELETE.

---

### PHIÊN 006: HỢP NHẤT TOÀN SUITE & BÁO CÁO NEWMAN (PHASE 6)
- **Thời gian:** 2026-09-01T13:42 $\rightarrow$ 2026-09-01T13:48 (GMT+7)
- **Mức Bloom-AI:** **G9.2 (Apply)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 6: Hợp nhất toàn bộ bộ ca kiểm thử của 3 API, chạy Newman trên toàn hệ thống và xuất báo cáo tổng kết chi tiết."*

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Tránh xung đột tài khoản Admin toàn cục):** Đổi tài khoản test lockout của API 1 sang dummy email để API 3 chạy mượt mà.
2. **Khúc sửa 2 (Tái lập CSDL SQLite):** Reseed CSDL về trạng thái gốc với 5 sản phẩm và 4 tài khoản chuẩn trước khi chạy Newman.
3. **Khúc sửa 3 (Kết xuất HTML Extra tổng hợp):** Chạy Newman tạo `reports/newman_full_suite.html` (2.93 MB) với 142 requests, 179 assertions.
4. **Khúc sửa 4 (Bảng phân tích tỷ lệ đạt chuẩn):** Lập `reports/summary.md` chứng minh 139 assertions Passed và 40 assertions Failed đều tương ứng với 13 bug thực tế.

---

### PHIÊN 007: CHUẨN HÓA GITHUB ISSUES (PHASE 7)
- **Thời gian:** 2026-09-01T13:50 $\rightarrow$ 2026-09-01T13:52 (GMT+7)
- **Mức Bloom-AI:** **G9.2 (Apply)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 7: Chuẩn hóa GitHub Issue Template, tạo thư mục issues/ chứa đầy đủ 13 bug report độc lập và tạo script tự động sinh."*

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Chuẩn hóa Issue Template):** Tạo `.github/ISSUE_TEMPLATE/bug_report.md` đầy đủ 7 trường kỹ thuật (Tiêu đề, Metadata, Steps to Reproduce, Actual/Expected, Root cause, Code diff).
2. **Khúc sửa 2 (Khóa issue trống):** Tạo `.github/ISSUE_TEMPLATE/config.yml` chặn tạo blank issue.
3. **Khúc sửa 3 (Tự động hóa sinh 13 issues):** Viết script `scripts/generate_issue_files.js` sinh 13 tệp Markdown độc lập trong `issues/`.
4. **Khúc sửa 4 (Bảng chỉ mục README):** Tạo `issues/README.md` lập bảng điều hướng 13 lỗi kèm nhãn và mức độ nghiêm trọng.

---

### PHIÊN 008: CI/CD PIPELINE TRÊN GITHUB ACTIONS (PHASE 8)
- **Thời gian:** 2026-09-01T14:02 $\rightarrow$ 2026-09-01T14:10 (GMT+7)
- **Mức Bloom-AI:** **G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 8: Xây dựng pipeline CI/CD GitHub Actions chạy Newman tự động, xuất báo cáo artifact và thực hiện đúng yêu cầu 2 commit: 1 commit pipeline Pass và 1 commit pipeline Fail."*

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (2 lệnh npm test cho CI):** Tạo `test:ci:pass` (chạy health check 100% pass) và `test:ci:fail` (chạy checkout có lỗi).
2. **Khúc sửa 2 (Khắc phục sự cố chưa thấy commit Pass):**
   - *Prompt người dùng (Nguyên văn):* *"chưa thấy được commit là pass ci cd hết á"*
   - *Nguyên nhân:* Push cùng lúc khiến GitHub Actions chỉ chạy commit Fail mới nhất.
   - *Hành động điều chỉnh của AI:* Khôi phục `test:ci:pass` trong workflow, tạo commit `3b3dad5` và push riêng lẻ lên GitHub $\rightarrow$ GitHub Actions kích hoạt thành công Run #33480707803 hiển thị trạng thái **SUCCESS ✅ (xanh lá)**.
3. **Khúc sửa 3 (Đính kèm Live Run Links):** Cập nhật đường dẫn trực tiếp của cả 2 Run vào `reports/ci_cd_report.md`.
4. **Khúc sửa 4 (Thu thập Artifacts luôn luôn):** Cấu hình `if: always()` để lưu trữ báo cáo HTML kiểm thử 14 ngày dù Pass hay Fail.

---

### PHIÊN 009: THIẾT KẾ AGENT SKILL TỰ ĐỘNG SINH TEST CASES (PHASE 9)
- **Thời gian:** 2026-09-01T14:12 $\rightarrow$ 2026-09-01T14:15 (GMT+7)
- **Mức Bloom-AI:** **G9.5 (Create)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 9: Thiết kế Agent Skill tự động sinh test cases từ đặc tả API (Bloom-AI G9.5 - Create), vẽ sơ đồ kiến trúc tự thiết kế, viết mã giả thuật toán và cài đặt mã nguồn thực thi."*

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Chuẩn hóa cấu trúc SKILL.md):** Tạo `.agents/skills/api-test-generator/SKILL.md` với YAML frontmatter và hướng dẫn 5 phân tầng kỹ thuật.
2. **Khúc sửa 2 (Sơ đồ kiến trúc tự vẽ):** Vẽ sơ đồ module 5 tầng và sơ đồ tương tác tuần tự Mermaid trong `reports/agent_skill_design.md`.
3. **Khúc sửa 3 (Mã giả thuật toán cấu trúc):** Xây dựng khối mã giả thuật toán `GenerateApiTestSuite` duyệt qua tham số, FSM, OWASP và schema.
4. **Khúc sửa 4 (Sửa lỗi đường dẫn CLI script):** Sửa lỗi nối chuỗi đường dẫn trong `generator.js` sang `process.cwd()`, chạy thực tế thành công xuất file `collections/Generated_Collection.json`.

---

### PHIÊN 010: BÁO CÁO TỔNG KẾT & PHẢN BIỆN AI (PHASE 10)
- **Thời gian:** 2026-09-01T14:18 $\rightarrow$ 2026-09-01T14:24 (GMT+7)
- **Mức Bloom-AI:** **G9.3 (Analyse) & G9.4 (Collaborate)**

#### 1. Prompt Yêu Cầu Ban Đầu:
> *"Đồng ý. Hãy tiến hành Phase 10: Biên soạn tài liệu REPORT.md tổng kết toàn bộ kết quả, viết đoạn phản biện AI Critique chuẩn 200–300 từ và lập tuyên bố sử dụng AI minh bạch."*

#### 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (4 Khúc Sửa):
1. **Khúc sửa 1 (Cấu trúc hóa REPORT.md):** Tổng kết đầy đủ 10 phần theo đúng chuẩn đánh giá bài tập môn học.
2. **Khúc sửa 2 (Kiểm soát dung lượng AI Critique):** Viết đoạn văn phản biện 3 điểm mù của AI đạt đúng **255 từ** (chuẩn 200–300 từ).
3. **Khúc sửa 3 (Tuyên bố học thuật minh bạch):** Công khai việc sử dụng AI và khẳng định 100% trách nhiệm kiểm toán của sinh viên.
4. **Khúc sửa 4 (Minh chứng Anti-Cheat):** Trích dẫn header `X-Student-Id: 23127327`, local hostname và sơ đồ kiến trúc tự vẽ.

---

## TỔNG KẾT THỐNG KÊ TOÀN DỰ ÁN

- **Tổng số phiên làm việc:** 11 phiên (Phiên 000 $\rightarrow$ Phiên 010).
- **Tổng số prompt sửa đổi / hiệu chỉnh của người dùng:** **47 khúc sửa chuyên sâu**.
- **Cấp độ Bloom-AI thực tế đạt được:**
  - **G9.2 (Apply):** Vận hành Node.js, SQLite, Postman scripting, Newman CLI, GitHub Actions.
  - **G9.3 (Analyse):** Bóc tách đặc tả SRS, phân tích mã nguồn SUT, phân loại ranh giới và xác thực 13 lỗi hệ thống.
  - **G9.4 (Collaborate):** Mô hình pair-programming chặt chẽ, người dùng trực tiếp phản biện và định hướng nghiệp vụ (Lockout dummy, Concurrency Overselling, CI/CD Pass demo).
  - **G9.5 (Create):** Thiết kế hoàn chỉnh Agent Skill `api-test-generator` kèm sơ đồ kiến trúc tự vẽ, mã giả và CLI script thực thi độc lập.
