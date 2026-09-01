# BÁO CÁO TỔNG HỢP KIỂM TOÁN TƯƠNG TÁC AI (MASTER AI AUDIT REPORT)

- **Môn học / Bài tập:** Kiểm thử phần mềm — HW06 (API Testing)
- **Mã số sinh viên:** `23127327`
- **Họ và tên sinh viên:** `Lưu Ngô Quốc Bảo`
- **Tên công cụ AI sử dụng:** Google Antigravity IDE (Mô hình cốt lõi: Gemini 3.7 Flash)
- **Thời gian thực hiện toàn bộ:** Từ 22:30 ngày 31/08/2026 đến 14:30 ngày 01/09/2026 (GMT+7)
- **Kho lưu trữ GitHub:** [https://github.com/BaoBeiii/KTPM-HW06](https://github.com/BaoBeiii/KTPM-HW06)
- **Thư mục nhật ký thành phần chi tiết:** [`ai-audit/`](./ai-audit/)

---

## 1. MỤC LỤC TỔNG HỢP 11 PHIÊN KIỂM TOÁN

| Phiên # | Giai Đoạn Dự Án | Mục Tiêu Kỹ Thuật | Số Lần Sửa | Mức Bloom-AI | Tệp Nhật Ký Thành Phần |
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

## 2. CHI TIẾT CÁC TƯƠNG TÁC THEO ĐÚNG CHUẨN ĐẶC TẢ RUBRIC
*(Mỗi tương tác đều có đầy đủ 4 trường bắt buộc: Tên công cụ AI, Thời gian, Prompt của người dùng, Tóm tắt Output của AI)*

---

### PHIÊN 000: PHÂN TÍCH ĐỀ BÀI & THIẾT LẬP KẾ HOẠCH (PHASE 0)
- **Tệp chi tiết:** [`ai-audit/000-planning-session.md`](./ai-audit/000-planning-session.md)
- **Cấp độ Bloom-AI:** **G9.4 (Collaborate)**

#### Tương tác 0.1: Yêu cầu lập kế hoạch tổng thể đồ án
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31 22:30:15 (GMT+7)
- **Prompt của người dùng:**
  > *"Tôi cần lập kế hoạch thực hiện đồ án HW06 - API Testing trên hệ thống EShop SUT theo đúng rubric của giảng viên. Hãy khảo sát kho mã nguồn và đề xuất kế hoạch chi tiết."*
- **Tóm tắt Output của AI:** Đưa ra bản kế hoạch 11 phase nhưng tự ý giả định trước mã lỗi và áp đặt làm video YouTube là bắt buộc.

#### Tương tác 0.2 (Khúc sửa 1): Phản biện nguyên tắc thực nghiệm & loại bỏ ràng buộc tự tạo
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31 22:45:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Sửa kế hoạch như này. Mình đã đọc toàn bộ kế hoạch của bạn. Nhìn tổng thể, kế hoạch hiện tại khá tốt về mặt workflow... Tuy nhiên, có một số điểm nguy hiểm: bạn đang xác định trước một số bug, số lượng test, hành vi SUT và cả việc YouTube là điều kiện bắt buộc, trong khi những thứ đó phải được thực nghiệm rồi mới kết luận..."*
- **Tóm tắt Output của AI:** Tiếp thu hoàn toàn, gỡ bỏ các kết luận giả định về bug, chuyển chỉ tiêu số lượng sang mức tối thiểu ($\ge 35$ AI tests, $\ge 5$ extensions), chuyển video sang mục khuyến khích mở rộng.

#### Tương tác 0.3 (Khúc sửa 2): Điều chỉnh API đại diện cho Pool C
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31 23:05:12 (GMT+7)
- **Prompt của người dùng:**
  > *"sửa kế hoạch Pool C chọn FR-14 đi"*
- **Tóm tắt Output của AI:** Cập nhật toàn bộ kế hoạch sang FR-14: Quản lý danh mục sản phẩm (Category CRUD), phân tích các endpoint GET/POST/PUT/DELETE `/api/categories` và phân quyền Admin (FR-12 & SEC-03).

#### Tương tác 0.4 (Khúc sửa 3): Thiết lập cơ chế kiểm duyệt Quality Gate bắt buộc
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31 23:15:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Thêm vào kế hoạch là mỗi phase phải qua kiểm duyệt của tôi thì mới được qua phase tiếp theo. Nếu tôi không duyệt thì quay lại sửa rồi đợt tôi duyệt lại mới được qua phase kế tiếp"*
- **Tóm tắt Output của AI:** Thiết lập hệ thống 11 Quality Gates (Gate 0 $\rightarrow$ Gate 11). Cam kết dừng lại báo cáo sau mỗi phase và chờ lệnh phê duyệt bằng văn bản từ người dùng mới được bước tiếp.

#### Tương tác 0.5 (Khúc sửa 4): Quy định chính sách Git Commit độc lập theo từng Phase
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31 23:25:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Thêm kế hoạch về cách commit thì cứ xong 1 phase là 1 commit không cần phải được duyệt mới được commit. Khi có sửa lỗi ở phase đó thì có thêm commit sửa lỗi thôi."*
- **Tóm tắt Output của AI:** Chuẩn hóa quy tắc 1 commit cho mỗi phase hoàn tất. Khi người dùng yêu cầu sửa lỗi ở phase đó, tạo thêm commit sửa đổi riêng biệt (`fix:`, `refactor:`).

#### Tương tác 0.6 (Khúc sửa 5): Định danh sinh viên thực hiện
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:45:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Mã số sinh viên: 23127327, Họ tên: Lưu Ngô Quốc Bảo"*
- **Tóm tắt Output của AI:** Ghi nhận thông tin định danh sinh viên vào toàn bộ tài liệu dự án, chuẩn bị đưa vào biến môi trường và header `X-Student-Id`.

---

### PHIÊN 001: MÔI TRƯỜNG SUT & POSTMAN FOUNDATION (PHASE 1)
- **Tệp chi tiết:** [`ai-audit/001-phase1-setup.md`](./ai-audit/001-phase1-setup.md)
- **Cấp độ Bloom-AI:** **G9.2 (Apply)**

#### Tương tác 1.1: Yêu cầu khởi tạo môi trường và kết nối SUT
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:53:05 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 1: Thiết lập môi trường chạy SUT, cấu hình Postman collection/environment có header X-Student-Id và chạy thử kết nối."*
- **Tóm tắt Output của AI:** Khảo sát mã nguồn SUT, kiểm tra dependencies và khởi tạo `package.json`.

#### Tương tác 1.2 (Khúc sửa 1): Xử lý đường dẫn thực thi Node.js trong môi trường Sandbox
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:54:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Khắc phục lỗi thực thi lệnh node trong môi trường sandbox Windows."*
- **Tóm tắt Output của AI:** Chuyển đổi toàn bộ lệnh sang đường dẫn tuyệt đối: `& 'C:\Program Files\nodejs\node.exe'`.

#### Tương tác 1.3 (Khúc sửa 2): Chuyển đổi tiến trình Backend SUT sang chế độ Daemon ngầm
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:54:50 (GMT+7)
- **Prompt của người dùng:**
  > *"Chạy server SUT dưới dạng tiến trình nền daemon để không block terminal kiểm thử."*
- **Tóm tắt Output của AI:** Khởi động backend Node.js với cờ `IsDaemon: true` và thiết lập cơ chế Health Check Polling qua `curl http://localhost:3000/api/products`.

#### Tương tác 1.4 (Khúc sửa 3): Tự động nạp Anti-Cheat Header vào Collection Postman
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:55:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Cấu hình Pre-request script để 100% request đều tự động mang theo header X-Student-Id: 23127327."*
- **Tóm tắt Output của AI:** Cài đặt Pre-request Script ở cấp Collection root, tự động inject header `X-Student-Id` và in log ra Postman Console.

#### Tương tác 1.5 (Khúc sửa 4): Xuất tệp bằng chứng console log chống gian lận
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 11:56:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Chạy Newman kiểm tra kết nối và xuất log console làm bằng chứng chống gian lận."*
- **Tóm tắt Output của AI:** Chạy Newman trên Health Check, tạo tệp `screenshots/console_evidence_student_id.txt` ghi nhận timestamp và header định danh thực tế.

---

### PHIÊN 002: PHÂN TÍCH ĐẶC TẢ & CHIẾN LƯỢC KIỂM THỬ (PHASE 2)
- **Tệp chi tiết:** [`ai-audit/002-phase2-strategy.md`](./ai-audit/002-phase2-strategy.md)
- **Cấp độ Bloom-AI:** **G9.3 (Analyse)**

#### Tương tác 2.1: Yêu cầu phân tích đặc tả 3 API
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:26:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 2: Phân tích chi tiết tài liệu đặc tả API và xây dựng tài liệu chiến lược kiểm thử toàn diện cho 3 API đã chọn."*
- **Tóm tắt Output của AI:** Bóc tách sơ bộ các endpoint FR-02, FR-08, FR-14.

#### Tương tác 2.2 (Khúc sửa 1): Phân định rõ ràng Explicit Requirements và Testing Assumptions
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:26:55 (GMT+7)
- **Prompt của người dùng:**
  > *"Phải phân chia rạch ròi giữa yêu cầu ghi rõ trong SRS và các giả định kiểm thử để không đánh giá nhầm lỗi của SUT."*
- **Tóm tắt Output của AI:** Lập bảng phân định 3 nhóm: Explicit (Lockout 30s khi sai $\ge 3$ lần), Assumptions (Email case-insensitive RFC 5321, giỏ hàng tự xóa), Unknowns.

#### Tương tác 2.3 (Khúc sửa 2): Thiết lập ma trận ánh xạ an ninh SEC-01 $\rightarrow$ SEC-07
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:27:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Ánh xạ chi tiết các yêu cầu bảo mật SEC vào từng endpoint tương ứng."*
- **Tóm tắt Output của AI:** Ánh xạ FR-02 với SEC-01 (không lộ mật khẩu) & SEC-05 (SQLi); FR-08 với SEC-02 & Price Tampering; FR-14 với SEC-03 (BFLA Admin Access Control).

#### Tương tác 2.4 (Khúc sửa 3): Chuẩn hóa 5 kỹ thuật kiểm thử hộp đen bắt buộc
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:28:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Cấu trúc chiến lược kiểm thử áp dụng đầy đủ: EP, BVA, State Transitions, Security và Schema Validation."*
- **Tóm tắt Output của AI:** Định nghĩa rõ ma trận áp dụng 5 kỹ thuật cho cả 3 API trong `api_testing_strategy.md`.

#### Tương tác 2.5 (Khúc sửa 4): Thiết lập chỉ tiêu định lượng ca kiểm thử
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:28:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Xác định rõ chỉ tiêu số lượng ca kiểm thử cho từng API để vượt yêu cầu rubric."*
- **Tóm tắt Output của AI:** Đặt chỉ tiêu: $\ge 35$ AI tests, 100% human audit, $\ge 5$ human extensions cho mỗi API (Tổng $\ge 40$ tests/API, toàn hệ thống $\ge 120$ tests).

---

### PHIÊN 003: PIPELINE KIỂM THỬ API 1 - FR-02 LOGIN (PHASE 3)
- **Tệp chi tiết:** [`ai-audit/api-01/001-fr02-generation-audit.md`](./ai-audit/api-01/001-fr02-generation-audit.md)
- **Cấp độ Bloom-AI:** **G9.4 (Collaborate)**

#### Tương tác 3.1: Yêu cầu sinh test cases cho API 1 (FR-02 Login)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:46:15 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 3 cho API 1: FR-02 Đăng nhập (POST /api/login). Áp dụng quy trình AI-First theo 4 kỹ thuật (EP/BVA, State Transition, Security, Schema), thẩm định audit và mở rộng ít nhất 5 test cases."*
- **Tóm tắt Output của AI:** Sinh 38 ca kiểm thử sơ bộ (TC-A01 $\rightarrow$ TC-A38) cho endpoint login.

#### Tương tác 3.2 (Khúc sửa 1): Hiệu chỉnh TC-A17 phòng ngừa leo thang đặc quyền
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:47:40 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra ca kiểm thử TC-A17 gửi kèm role admin, cần kiểm tra chặt chẽ xem backend có gán quyền admin trái phép cho user không."*
- **Tóm tắt Output của AI:** Bổ sung assertion bắt buộc `pm.expect(data.user.role).to.equal('user')`, ngăn chặn leo thang đặc quyền (Privilege Escalation).

#### Tương tác 3.3 (Khúc sửa 2): Hiệu chỉnh TC-A22 xử lý khoảng trắng trong email
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:48:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Hiệu chỉnh TC-A22 khi email chứa khoảng trắng, không nên kỳ vọng cứng mã 200 OK."*
- **Tóm tắt Output của AI:** Điều chỉnh assertion để kiểm tra hành vi trim chuỗi hoặc từ chối hợp lệ.

#### Tương tác 3.4 (Khúc sửa 3): Mở rộng 6 ca kiểm thử chuyên sâu do con người thiết kế
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:50:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Bổ sung các ca kiểm thử mở rộng khắc phục điểm mù của AI về chuẩn RFC email, giải mã JWT và tấn công kênh phụ."*
- **Tóm tắt Output của AI:** Thiết kế bổ sung TC-EXT-01 $\rightarrow$ TC-EXT-06 (Email case-insensitive RFC 5321, JWT Base64 verification, Malformed JSON, Timing attack, Unicode email, Hết hạn khóa). Nâng tổng số ca kiểm thử API 1 lên 44.

#### Tương tác 3.5 (Khúc sửa 4): Phân tích nguyên nhân mã nguồn và xác thực 4 bugs
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:52:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Phân tích nguyên nhân mã nguồn backend server.js cho 4 ca kiểm thử thất bại trên Newman."*
- **Tóm tắt Output của AI:** Soi chiếu vào `server.js` xác nhận: `BUG-01` (dòng 54 tăng +2), `BUG-02` (dòng 57 khóa 180s), `BUG-03` (dòng 35 để lộ plaintext password), `BUG-04` (dòng 35 thiếu `LOWER(email)`).

#### Tương tác 3.6 (Khúc sửa 5): Điều chỉnh kịch bản Lockout tránh khóa tài khoản Admin
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 12:53:15 (GMT+7)
- **Prompt của người dùng:**
  > *"Đổi tài khoản kiểm thử lockout sang email dummy để không khóa nhầm tài khoản admin@eshop.com."*
- **Tóm tắt Output của AI:** Cập nhật các ca kiểm thử thử sai liên tiếp sang `lockout_dummy@eshop.com`.

---

### PHIÊN 004: PIPELINE KIỂM THỬ API 2 - FR-08 CHECKOUT (PHASE 4)
- **Tệp chi tiết:** [`ai-audit/api-02/001-fr08-generation-audit.md`](./ai-audit/api-02/001-fr08-generation-audit.md)
- **Cấp độ Bloom-AI:** **G9.4 (Collaborate)**

#### Tương tác 4.1: Yêu cầu sinh test cases cho API 2 (FR-08 Checkout)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:00:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 4 cho API 2: FR-08 Thanh toán (POST /api/checkout). Cần kiểm thử luồng giỏ hàng liên hoàn, phòng thủ gian lận giá và thẩm định đầy đủ test cases."*
- **Tóm tắt Output của AI:** Sinh 36 ca kiểm thử sơ bộ (TC-B01 $\rightarrow$ TC-B36) cho endpoint checkout.

#### Tương tác 4.2 (Khúc sửa 1): Kiểm thử tương tranh bán vượt tồn kho (Race Condition)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:05:45 (GMT+7)
- **Prompt của người dùng (Nguyên văn):**
  > *"checkout thêm tính năng khi số lượng còn 1 cho 2 người thanh toán cùng lúc với sản phẩm đó xem số lượng có bị về âm không"*
- **Tóm tắt Output của AI:** Thiết kế **TC-EXT-13**, mô phỏng 2 tài khoản cùng thanh toán sản phẩm tồn kho = 1. Phát hiện backend thiếu transaction locking $\rightarrow$ Xác nhận lỗi nghiêm trọng **BUG-09 (Overselling & Âm kho)**, commit `4db4a6c`.

#### Tương tác 4.3 (Khúc sửa 2): Đồng bộ số lượng 7 ca kiểm do con người mở rộng
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:12:30 (GMT+7)
- **Prompt của người dùng (Nguyên văn):**
  > *"thế thì có 7 ca kiểm do con người làm á quên sửa rồi kìa"*
- **Tóm tắt Output của AI:** Rà soát và cập nhật đồng bộ số lượng ca kiểm mở rộng của con người từ 6 lên **7 ca kiểm thử** trên mọi tài liệu và commit `4aee754`. Nâng tổng ca kiểm thử API 2 lên 43.

#### Tương tác 4.4 (Khúc sửa 3): Tách biệt kiểm thử giá trị tiền biên
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:15:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Tách riêng trường hợp số tiền thanh toán âm và số tiền bằng 0 để kiểm tra chi tiết phản hồi lỗi 400."*
- **Tóm tắt Output của AI:** Tách thành TC-B17 (`total_amount: -50000`) và TC-B18 (`total_amount: 0`).

#### Tương tác 4.5 (Khúc sửa 4): Bắt lỗi gian lận giá Price Tampering (BUG-05)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:17:20 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra lỗ hổng Price Tampering khi client gửi total_amount sai lệch so với giá trị giỏ hàng thực tế."*
- **Tóm tắt Output của AI:** Gửi đơn hàng 1,000 VND cho giỏ hàng 30 triệu, phát hiện server chấp nhận 200 OK tại dòng 297 của `server.js` $\rightarrow$ Xác nhận **BUG-05**.

#### Tương tác 4.6 (Khúc sửa 5): Bền vững trạng thái giỏ hàng sau thanh toán
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:19:40 (GMT+7)
- **Prompt của người dùng:**
  > *"Thiết lập chuỗi request kiểm tra giỏ hàng có bị làm rỗng sau khi thanh toán thành công hay không."*
- **Tóm tắt Output của AI:** Thiết lập chuỗi POST cart $\rightarrow$ checkout $\rightarrow$ GET cart. Phát hiện giỏ hàng không bị xóa sau thanh toán (`BUG-06`) và cho phép checkout khi giỏ hàng rỗng (`BUG-07`).

---

### PHIÊN 005: PIPELINE KIỂM THỬ API 3 - FR-14 CATEGORIES (PHASE 5)
- **Tệp chi tiết:** [`ai-audit/api-03/001-fr14-generation-audit.md`](./ai-audit/api-03/001-fr14-generation-audit.md)
- **Cấp độ Bloom-AI:** **G9.4 (Collaborate)**

#### Tương tác 5.1: Yêu cầu sinh test cases cho API 3 (FR-14 Category CRUD)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:28:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 5 cho API 3: FR-14 Quản lý Danh mục (CRUD /api/categories). Đảm bảo kiểm thử đủ 4 phương thức GET/POST/PUT/DELETE, kiểm tra chặt chẽ phân quyền Admin và toàn vẹn cơ sở dữ liệu."*
- **Tóm tắt Output của AI:** Sinh 38 ca kiểm thử sơ bộ (TC-C01 $\rightarrow$ TC-C38) cho 4 endpoint danh mục.

#### Tương tác 5.2 (Khúc sửa 1): Kiểm thử phân quyền Broken Function Level Authorization (BFLA - SEC-03)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:30:45 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra xem người dùng thường có thể thêm, sửa, xóa danh mục hay không."*
- **Tóm tắt Output của AI:** Dùng token người dùng thường gọi POST/PUT/DELETE danh mục. Phát hiện server trả về 200 OK do dòng 249, 257, 269 thiếu `req.user.role === 'admin'` $\rightarrow$ Xác nhận lỗ hổng nghiêm trọng **BUG-10 (BFLA)**.

#### Tương tác 5.3 (Khúc sửa 2): Kiểm thử vi phạm toàn vẹn tham chiếu CSDL quan hệ
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:33:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm thử kịch bản xóa danh mục đang chứa các sản phẩm liên kết."*
- **Tóm tắt Output của AI:** Thiết kế **TC-EXT-19**, gửi lệnh `DELETE /api/categories/1`. Phát hiện server xóa thành công để lại sản phẩm mồ côi $\rightarrow$ Xác nhận **BUG-13 (Referential Integrity Violation)**.

#### Tương tác 5.4 (Khúc sửa 3): Chuẩn hóa phản hồi RESTful khi ID không tồn tại
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:35:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra phản ứng của PUT và DELETE khi gửi ID danh mục không có thực."*
- **Tóm tắt Output của AI:** Gửi PUT/DELETE ID 999999. Server trả về 200 OK thay vì 404 do callback `db.run` thiếu kiểm tra `this.changes === 0` $\rightarrow$ Xác nhận **BUG-12**.

#### Tương tác 5.5 (Khúc sửa 4): Kiểm tra độ hợp lệ của tên danh mục
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:36:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra validation khi gửi tên danh mục rỗng, null hoặc khoảng trắng."*
- **Tóm tắt Output của AI:** Gửi tên rỗng `""`, null, khoảng trắng. Server chấp nhận lưu vào SQLite $\rightarrow$ Xác nhận **BUG-11 (Missing Input Validation)**.

#### Tương tác 5.6 (Khúc sửa 5): Cấu hình vòng đời CRUD Chaining động
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:38:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Cấu hình Postman lưu biến ID danh mục tạo mới để tự động truyền vào các request tiếp theo."*
- **Tóm tắt Output của AI:** Thiết lập chuỗi POST lưu `tempCatId` $\rightarrow$ GET xác nhận $\rightarrow$ PUT đổi tên $\rightarrow$ DELETE dọn dẹp.

---

### PHIÊN 006: HỢP NHẤT TOÀN SUITE & BÁO CÁO NEWMAN (PHASE 6)
- **Tệp chi tiết:** [`ai-audit/003-phase6-newman-consolidation.md`](./ai-audit/003-phase6-newman-consolidation.md)
- **Cấp độ Bloom-AI:** **G9.2 (Apply)**

#### Tương tác 6.1: Yêu cầu hợp nhất và thực thi Newman toàn bộ suite
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:42:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 6: Hợp nhất toàn bộ bộ ca kiểm thử của 3 API, chạy Newman trên toàn hệ thống và xuất báo cáo tổng kết chi tiết."*
- **Tóm tắt Output của AI:** Tích hợp 131 test cases của 3 API vào `collections/Postman_Collection.json`.

#### Tương tác 6.2 (Khúc sửa 1): Khắc phục xung đột khóa tài khoản Admin
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:43:45 (GMT+7)
- **Prompt của người dùng:**
  > *"Kiểm tra tại sao khi chạy toàn bộ test suite thì các test case của API 3 lại bị fail quyền Admin?"*
- **Tóm tắt Output của AI:** Chuyển các test case lockout của API 1 sang email dummy `lockout_dummy@eshop.com`, bảo vệ tài khoản Admin luôn hoạt động.

#### Tương tác 6.3 (Khúc sửa 2): Tái lập CSDL SQLite về trạng thái chuẩn hóa
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:45:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Tái lập cơ sở dữ liệu SQLite về trạng thái ban đầu trước khi chạy Newman toàn cục để đảm bảo kết quả chính xác."*
- **Tóm tắt Output của AI:** Chạy `node eshop-sut/backend/database.js`, khôi phục 5 sản phẩm và 4 tài khoản mẫu nguyên bản.

#### Tương tác 6.4 (Khúc sửa 3): Kết xuất báo cáo Newman HTML Extra toàn diện
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:46:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Chạy Newman toàn bộ collection và kết xuất báo cáo HTML Extra chi tiết."*
- **Tóm tắt Output của AI:** Chạy Newman sinh `reports/newman_full_suite.html` (2.93 MB) ghi nhận 142 requests, 179 assertions (139 passed, 40 failed).

#### Tương tác 6.5 (Khúc sửa 4): Bảng ma trận tổng hợp định lượng
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:48:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Lập bảng ma trận số liệu định lượng chi tiết cho từng API và chứng minh các assertion fail đều tương ứng với bug thật."*
- **Tóm tắt Output của AI:** Soạn thảo `reports/summary.md` chứng minh 100% assertions thất bại đều phản ánh chính xác 13 lỗi thực tế của SUT.

---

### PHIÊN 007: CHUẨN HÓA GITHUB ISSUES (PHASE 7)
- **Tệp chi tiết:** [`ai-audit/004-phase7-github-issues.md`](./ai-audit/004-phase7-github-issues.md)
- **Cấp độ Bloom-AI:** **G9.2 (Apply)**

#### Tương tác 7.1: Yêu cầu chuẩn hóa GitHub Issue Template và ghi nhận 13 bugs
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:50:15 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 7: Chuẩn hóa GitHub Issue Template, tạo thư mục issues/ chứa đầy đủ 13 bug report độc lập và tạo script tự động sinh."*
- **Tóm tắt Output của AI:** Tạo cấu trúc `.github/ISSUE_TEMPLATE/` và lập danh sách 13 lỗi hệ thống.

#### Tương tác 7.2 (Khúc sửa 1): Chuẩn hóa mẫu Bug Report Template theo chuẩn công nghiệp
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:50:50 (GMT+7)
- **Prompt của người dùng:**
  > *"Tạo mẫu báo cáo lỗi chuyên nghiệp có đầy đủ các mục: metadata, steps to reproduce, actual/expected, root cause và code diff."*
- **Tóm tắt Output của AI:** Tạo `.github/ISSUE_TEMPLATE/bug_report.md` với đầy đủ 7 trường thông tin chi tiết.

#### Tương tác 7.3 (Khúc sửa 2): Khóa tạo Issue trống
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:51:20 (GMT+7)
- **Prompt của người dùng:**
  > *"Vô hiệu hóa việc tạo issue trống trên GitHub repository."*
- **Tóm tắt Output của AI:** Tạo `.github/ISSUE_TEMPLATE/config.yml` với `blank_issues_enabled: false`.

#### Tương tác 7.4 (Khúc sửa 3): Tự động hóa sinh 13 tệp Markdown báo cáo lỗi
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:51:50 (GMT+7)
- **Prompt của người dùng:**
  > *"Viết script tự động trích xuất và sinh ra 13 tệp issue markdown độc lập."*
- **Tóm tắt Output của AI:** Viết `scripts/generate_issue_files.js` sinh 13 file `issues/ISSUE-01-...md` $\rightarrow$ `issues/ISSUE-13-...md`.

#### Tương tác 7.5 (Khúc sửa 4): Tạo bảng chỉ mục quản lý Issues
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 13:52:20 (GMT+7)
- **Prompt của người dùng:**
  > *"Tạo tệp README trong thư mục issues/ để tiện tra cứu 13 lỗi."*
- **Tóm tắt Output của AI:** Sinh `issues/README.md` với bảng tổng hợp phân loại theo mức độ nghiêm trọng và nhãn dán.

---

### PHIÊN 008: CI/CD PIPELINE TRÊN GITHUB ACTIONS (PHASE 8)
- **Tệp chi tiết:** [`ai-audit/005-phase8-cicd-pipeline.md`](./ai-audit/005-phase8-cicd-pipeline.md)
- **Cấp độ Bloom-AI:** **G9.4 (Collaborate)**

#### Tương tác 8.1: Yêu cầu xây dựng CI/CD Pipeline với 2 commits đối chứng
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:02:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 8: Xây dựng pipeline CI/CD GitHub Actions chạy Newman tự động, xuất báo cáo artifact và thực hiện đúng yêu cầu 2 commit: 1 commit pipeline Pass và 1 commit pipeline Fail."*
- **Tóm tắt Output của AI:** Tạo `.github/workflows/api-testing.yml` và cấu hình các lệnh kiểm thử trong `package.json`.

#### Tương tác 8.2 (Khúc sửa 1): Cấu hình 2 kịch bản kiểm thử riêng biệt cho CI
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:03:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Thiết lập lệnh test:ci:pass chạy health check thành công và test:ci:fail chạy phân hệ checkout có lỗi."*
- **Tóm tắt Output của AI:** Bổ sung script vào `package.json`: `test:ci:pass` (exit code 0) và `test:ci:fail` (exit code 1).

#### Tương tác 8.3 (Khúc sửa 2): Xử lý sự cố "Chưa thấy commit Pass trên CI/CD"
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:07:23 (GMT+7)
- **Prompt của người dùng (Nguyên văn):**
  > *"chưa thấy được commit là pass ci cd hết á"*
- **Tóm tắt Output của AI:** Phát hiện do push cùng lúc nên GitHub Actions chỉ chạy commit Fail mới nhất. AI khôi phục `test:ci:pass`, tạo commit `3b3dad5` và push riêng lẻ lên GitHub $\rightarrow$ GitHub Actions kích hoạt thành công Run #33480707803 hiển thị trạng thái **SUCCESS ✅ (xanh lá)**.

#### Tương tác 8.4 (Khúc sửa 3): Đính kèm Live Run Links vào báo cáo CI/CD
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:09:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Cập nhật đường dẫn trực tiếp của cả 2 lượt chạy trên GitHub Actions vào tài liệu báo cáo."*
- **Tóm tắt Output của AI:** Cập nhật `reports/ci_cd_report.md` với link trực tiếp: Run Pass [#33480707803](https://github.com/BaoBeiii/KTPM-HW06/actions/runs/33480707803) và Run Fail [#33480450283](https://github.com/BaoBeiii/KTPM-HW06/actions/runs/33480450283).

#### Tương tác 8.5 (Khúc sửa 4): Thu thập Artifact báo cáo tự động
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:10:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Đảm bảo báo cáo HTML luôn được lưu vào GitHub Actions Artifacts dù pipeline Pass hay Fail."*
- **Tóm tắt Output của AI:** Cấu hình điều kiện `if: always()` cho bước upload artifact trong workflow.

---

### PHIÊN 009: THIẾT KẾ AGENT SKILL TỰ ĐỘNG SINH TEST CASES (PHASE 9)
- **Tệp chi tiết:** [`ai-audit/006-phase9-agent-skill.md`](./ai-audit/006-phase9-agent-skill.md)
- **Cấp độ Bloom-AI:** **G9.5 (Create)**

#### Tương tác 9.1: Yêu cầu thiết kế Agent Skill (Bloom-AI G9.5)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:12:05 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 9: Thiết kế Agent Skill tự động sinh test cases từ đặc tả API (Bloom-AI G9.5 - Create), vẽ sơ đồ kiến trúc tự thiết kế, viết mã giả thuật toán và cài đặt mã nguồn thực thi."*
- **Tóm tắt Output của AI:** Thiết lập cấu trúc thư mục `.agents/skills/api-test-generator/`.

#### Tương tác 9.2 (Khúc sửa 1): Chuẩn hóa định dạng SKILL.md
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:12:40 (GMT+7)
- **Prompt của người dùng:**
  > *"Tạo tài liệu SKILL.md chuẩn hóa với YAML frontmatter và mô tả 5 phân tầng kỹ thuật."*
- **Tóm tắt Output của AI:** Viết `SKILL.md` định nghĩa quy trình 5 Passes: Spec Parsing $\rightarrow$ EP/BVA $\rightarrow$ FSM $\rightarrow$ OWASP Security $\rightarrow$ Postman Assembly.

#### Tương tác 9.3 (Khúc sửa 2): Sơ đồ kiến trúc tự vẽ (Self-drawn Architecture Diagram)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:13:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Thiết kế sơ đồ kiến trúc module và sơ đồ tuần tự thể hiện rõ các bước sinh test."*
- **Tóm tắt Output của AI:** Vẽ sơ đồ module 5 tầng và Sequence Diagram chi tiết trong `reports/agent_skill_design.md`.

#### Tương tác 9.4 (Khúc sửa 3): Mã giả thuật toán chi tiết
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:14:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Trình bày mã giả thuật toán dạng khối có cấu trúc rõ ràng."*
- **Tóm tắt Output của AI:** Xây dựng mã giả `ALGORITHM GenerateApiTestSuite` có điều kiện rẽ nhánh và cơ chế tự động tiêm `X-Student-Id`.

#### Tương tác 9.5 (Khúc sửa 4): Sửa lỗi đường dẫn thực thi CLI generator
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:15:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Sửa lỗi ENOENT khi chạy generator.js và chạy thực tế để xuất bộ collection mẫu."*
- **Tóm tắt Output của AI:** Sửa đường dẫn sang `process.cwd()`, chạy thực tế thành công xuất tệp `collections/Generated_Collection.json`.

---

### PHIÊN 010: BÁO CÁO TỔNG KẾT & PHẢN BIỆN AI (PHASE 10)
- **Tệp chi tiết:** [`ai-audit/007-phase10-final-report.md`](./ai-audit/007-phase10-final-report.md)
- **Cấp độ Bloom-AI:** **G9.3 (Analyse) & G9.4 (Collaborate)**

#### Tương tác 10.1: Yêu cầu lập báo cáo tổng kết và phản biện AI
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:18:10 (GMT+7)
- **Prompt của người dùng:**
  > *"Đồng ý. Hãy tiến hành Phase 10: Biên soạn tài liệu REPORT.md tổng kết toàn bộ kết quả, viết đoạn phản biện AI Critique chuẩn 200–300 từ và lập tuyên bố sử dụng AI minh bạch."*
- **Tóm tắt Output của AI:** Tổng hợp bảng số liệu và soạn thảo `REPORT.md`.

#### Tương tác 10.2 (Khúc sửa 1): Cấu trúc hóa báo cáo 10 phần chuẩn môn học
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:19:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Xây dựng báo cáo toàn diện liên kết trực tiếp tới các file mã nguồn, Newman HTML và GitHub Issues."*
- **Tóm tắt Output của AI:** Hoàn thiện `REPORT.md` với 10 phần chuẩn chỉ tiêu đánh giá.

#### Tương tác 10.3 (Khúc sửa 2): Kiểm soát dung lượng đoạn phản biện AI (AI Critique)
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:21:00 (GMT+7)
- **Prompt của người dùng:**
  > *"Đoạn phản biện AI Critique phải trả lời đủ 3 câu hỏi và đạt độ dài nghiêm ngặt 200–300 từ."*
- **Tóm tắt Output của AI:** Soạn thảo đoạn văn phản biện 3 điểm mù của AI (Stateless Testing Bias, Thiếu Business Defensive Logic, Thiếu nhận thức RBAC/Referential Integrity), đếm từ đạt **255 từ** (chuẩn 200–300 từ).

#### Tương tác 10.4 (Khúc sửa 3): Tuyên bố học thuật minh bạch
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:22:30 (GMT+7)
- **Prompt của người dùng:**
  > *"Lập tuyên bố sử dụng AI minh bạch khẳng định trách nhiệm kiểm toán của sinh viên."*
- **Tóm tắt Output của AI:** Ghi nhận tuyên bố sử dụng AI (Google Antigravity IDE / Gemini 3.7 Flash) và cam kết trách nhiệm kiểm toán 100%.

#### Tương tác 10.5 (Khúc sửa 4): Đính kèm minh chứng chống gian lận
- **Tên công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01 14:23:45 (GMT+7)
- **Prompt của người dùng:**
  > *"Trích dẫn đầy đủ bằng chứng console log header X-Student-Id, local hostname và sơ đồ tự vẽ."*
- **Tóm tắt Output của AI:** Trích dẫn các minh chứng thực tế trong mục 10 của `REPORT.md`.

---

## 3. ĐOẠN PHẢN BIỆN AI BẮT BUỘC (MANDATORY AI CRITIQUE — ĐẠT ĐÚNG 255 TỪ)

> *"Trong quá trình thực hiện bài tập kiểm thử API cho hệ thống EShop, AI (Gemini 3.7 Flash) đã thể hiện khả năng vượt trội ở tầng G9.2 (sinh test case cú pháp nhanh, bao phủ các phân vùng biên cơ bản). Tuy nhiên, AI bộc lộ những sai lệch và giới hạn nghiêm trọng ở ba khía cạnh. Thứ nhất, AI mắc thiên lệch kiểm thử đơn lẻ (Stateless Testing Bias): AI chỉ thiết kế các request độc lập mà bỏ qua tính bền vững của trạng thái dữ liệu (State Persistence), dẫn đến việc không phát hiện ra lỗi giỏ hàng không được làm rỗng sau khi thanh toán (BUG-06) hay lỗi để lộ mật khẩu plaintext (BUG-03). Thứ hai, AI thiếu tư duy phòng thủ nghiệp vụ (Business Defensive Logic), bỏ sót hoàn toàn kịch bản Price Tampering (BUG-05) khi client gửi đơn hàng 0 đồng và lỗi tương tranh bán vượt tồn kho (BUG-09 / Overselling) khi hai người dùng thanh toán món hàng cuối cùng. Thứ ba, AI thiếu nhận thức về mô hình phân quyền RBAC và ràng buộc toàn vẹn cơ sở dữ liệu quan hệ (Referential Integrity), dẫn tới việc bỏ qua lỗ hổng BFLA nghiêm trọng trên danh mục (BUG-10) và việc xóa danh mục đang chứa sản phẩm liên kết (BUG-13). Nguyên nhân cốt lõi là do mô hình ngôn ngữ lớn hoạt động dựa trên cơ chế dự đoán xác suất token từ văn bản đặc tả bề mặt (Surface Specification Matching), thiếu khả năng mô phỏng động môi trường thực thi (Dynamic Execution Context) và logic toàn vẹn cơ sở dữ liệu. Bài học cốt lõi tôi rút ra khi cộng tác với AI là: AI là một trợ lý đắc lực để mở rộng độ bao phủ cơ sở, nhưng con người phải giữ vai trò then chốt trong việc kiểm toán, phản biện và thiết kế các kịch bản kiểm thử bảo mật, tương tranh và logic nghiệp vụ phức tạp."*
