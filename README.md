# HW06 – API Testing (EShop SUT)

## 1. Thông Tin Sinh Viên
- **Họ và tên:** Lưu Ngô Quốc Bảo
- **Mã số sinh viên (MSSV):** 23127327
- **Môn học:** Kiểm thử phần mềm (Software Testing)
- **Giảng viên hướng dẫn:** TS. Lâm Quang Vũ, TS. Trần Duy Hoàng, ThS. Trần Thị Bích Hạnh, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh
- **Khoa:** Công nghệ Thông tin – Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM
- **Kho lưu trữ GitHub:** [https://github.com/BaoBeiii/KTPM-HW06](https://github.com/BaoBeiii/KTPM-HW06)

---

## 2. Lựa Chọn 3 API Kiểm Thử

| Phân hệ (Pool) | Chức năng (Feature) | Endpoint | Phương thức | Trọng tâm kiểm thử |
| :--- | :--- | :--- | :---: | :--- |
| **Pool A** | **FR-02:** Đăng nhập & Khóa tài khoản | `/api/login` | `POST` | Xác thực JWT, validation email/mật khẩu, logic lockout 30s, SEC-01, SQLi |
| **Pool B** | **FR-08:** Đặt hàng (Checkout) | `/api/checkout` | `POST` | Phụ thuộc giỏ hàng, tính toán giá backend, xóa giỏ sau checkout, XSS, Price Tampering, Concurrency Overselling |
| **Pool C** | **FR-14:** Quản lý Danh mục (CRUD) | `/api/categories`<br>`/api/categories/:id` | `POST`<br>`GET`<br>`PUT`<br>`DELETE` | Phân quyền Admin RBAC (SEC-03, FR-12 BFLA), vòng đời CRUD danh mục, toàn vẹn quan hệ CSDL |

---

## 3. Cấu Trúc Thư Mục Dự Án

```text
KTPM-HW06/
├── 2026.HW06.API Testing_En.md    # Đề bài & Quy chế chính thức
├── 2026.HW06.API Testing_En.pdf    # Đề bài định dạng PDF
├── README.md                       # Tài liệu tổng quan & Bảng tự đánh giá
├── REPORT.md                       # Báo cáo tổng kết chính thức toàn diện
├── AI_AUDIT_REPORT.md              # Báo cáo kiểm toán AI tổng hợp (11 phiên, 47 khúc sửa)
├── git_commit_log.txt              # Lịch sử Git Commit định dạng văn bản (Mục 12)
├── api_testing_strategy.md         # Phân tích đặc tả & ma trận 5 kỹ thuật kiểm thử
├── test_cases.md                   # Hồ sơ chi tiết 131 ca kiểm thử (112 AI + 19 Human)
├── bug_report.md                   # Báo cáo chi tiết 13 lỗi hệ thống đã xác thực
├── package.json                    # Cấu hình scripts thực thi Newman & CI
├── eshop-sut/                      # Mã nguồn hệ thống SUT (Node.js Express + SQLite3)
│   └── backend/                    # Server backend (server.js, database.js)
├── collections/                    # Postman Collection v2.1.0 & Environment
│   ├── Postman_Collection.json     # Bộ sưu tập kiểm thử 142 requests
│   └── Postman_Environment.json    # Biến môi trường (baseUrl, tokens, X-Student-Id)
├── reports/                        # Báo cáo kết quả thực thi
│   ├── newman_full_suite.html      # Báo cáo Newman HTML Extra toàn hệ thống (2.93 MB)
│   ├── summary.md                  # Bảng phân tích định lượng kết quả kiểm thử
│   ├── ci_cd_report.md             # Báo cáo CI/CD GitHub Actions kèm live run links
│   └── agent_skill_design.md       # Thiết kế kiến trúc Agent Skill (Bloom-AI G9.5)
├── ai-audit/                       # Nhật ký AI Audit chi tiết từng thành phần
│   ├── 000-planning-session.md     # Phiên 000: Khởi tạo & Kế hoạch
│   ├── 001-phase1-setup.md         # Phiên 001: Môi trường & Anti-Cheat
│   ├── 002-phase2-strategy.md      # Phiên 002: Đặc tả & Chiến lược
│   ├── api-01/                     # Phiên 003: API 1 (FR-02 Login)
│   ├── api-02/                     # Phiên 004: API 2 (FR-08 Checkout)
│   ├── api-03/                     # Phiên 005: API 3 (FR-14 Categories)
│   ├── 003-phase6-newman-consolidation.md  # Phiên 006: Newman toàn cục
│   ├── 004-phase7-github-issues.md         # Phiên 007: GitHub Issues
│   ├── 005-phase8-cicd-pipeline.md         # Phiên 008: CI/CD Pipeline
│   ├── 006-phase9-agent-skill.md           # Phiên 009: Agent Skill
│   └── 007-phase10-final-report.md         # Phiên 010: Báo cáo & Phản biện
├── issues/                         # Hồ sơ 13 GitHub Issues độc lập (ISSUE-01 -> 13)
├── .github/                        # Cấu hình GitHub Actions & Issue Templates
│   ├── workflows/api-testing.yml   # Workflow CI/CD tự động
│   └── ISSUE_TEMPLATE/             # Template báo cáo lỗi chuẩn hóa
├── .agents/skills/                 # Cài đặt Agent Skill api-test-generator
└── screenshots/                    # Ảnh chụp bằng chứng console log & Newman
```

---

## 4. Bảng Tự Đánh Giá (Self-Assessment)

| STT | Tiêu chí đánh giá theo Rubric | Điểm tối đa | Điểm tự đánh giá | Minh chứng & Ghi chú |
| :---: | :--- | :---: | :---: | :--- |
| 1 | **API 1 (FR-02 Login):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | **30** | 44 tests (38 AI + 6 Ext), bắt 4 bugs (`BUG-01` $\rightarrow$ `BUG-04`), báo cáo HTML |
| 2 | **API 2 (FR-08 Checkout):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | **30** | 43 tests (36 AI + 7 Ext), bắt 5 bugs (`BUG-05` $\rightarrow$ `BUG-09`), test tương tranh âm kho |
| 3 | **API 3 (FR-14 Category CRUD):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | **30** | 44 tests (38 AI + 6 Ext), bắt 4 bugs (`BUG-10` $\rightarrow$ `BUG-13`), BFLA & khóa ngoại |
| 4 | **Agent Skill:** Sơ đồ tự thiết kế + Mã giả + Cài đặt CLI generator (Bloom-AI G9.5) | 10 | **10** | Sơ đồ 5 tầng tự vẽ, mã giả khối, script thực thi sinh collection tự động |
| **TỔNG** | **Toàn bộ bài tập lớn HW06** | **100** | **100/100** | Vượt mức mọi chỉ tiêu tối thiểu của đề tài |

---

## 5. Báo Cáo Tổng Hợp Kiểm Thử (Test Summary Report)

*(Theo yêu cầu Mục 14 của đề bài: Số lượng API; Số ca kiểm thử sinh ra, mở rộng, thực thi, pass, fail; và Số lượng bug)*

| Chỉ số kỹ thuật | Giá trị thực tế | Ghi chú & Đối chiếu Rubric |
| :--- | :---: | :--- |
| **Số lượng API kiểm thử** | **3 APIs** | 1 API từ mỗi Pool (A: FR-02, B: FR-08, C: FR-14) |
| **Ca kiểm thử do AI sinh (Generated)** | **112 test cases** | Đạt trung bình 37.3 tests/API (vượt chỉ tiêu $\ge 35$) |
| **Ca kiểm thử thẩm định (Human Audited)** | **112 test cases** | 100% được thẩm định (108 VALID, 4 INCOMPLETE) |
| **Ca kiểm thử con người mở rộng (Added)** | **19 test cases** | Vượt chỉ tiêu $\ge 5$ tests/API (API 1: 6, API 2: 7, API 3: 6) |
| **Tổng số ca kiểm thử thiết kế** | **131 test cases** | Vượt chỉ tiêu toàn hệ thống $\ge 120$ |
| **Tổng số HTTP Requests thực thi** | **142 requests** | Gồm 131 tests + Health Check + Setup/Teardown Chaining |
| **Tổng số Assertions thực thi** | **179 assertions** | Chạy tự động qua Newman CLI |
| **Số Assertions ĐẠT (Passed)** | **139 assertions** | Tỷ lệ 77.7% |
| **Số Assertions KHÔNG ĐẠT (Failed)** | **40 assertions** | Tỷ lệ 22.3% — 100% phản ánh đúng lỗi thực tế của SUT |
| **Số lượng lỗi hệ thống xác thực (Bugs)** | **13 bugs** | 3 Critical, 7 Major, 3 Medium (lập hồ sơ GitHub Issues) |

---

## 6. Lịch Sử Git Commit Log (Section 12 Compliance)

Toàn bộ quy trình thực hiện đồ án tuân thủ nghiêm ngặt chính sách phân đoạn commit theo từng bước và phase. Lịch sử commit chi tiết có thể xem trực tiếp tại tệp [`git_commit_log.txt`](./git_commit_log.txt):

| STT | Mã Commit | Thời Gian (GMT+7) | Thông Điệp Commit (Commit Message) | Phase Tương Ứng |
| :---: | :---: | :---: | :--- | :--- |
| 18 | `186b49e` | 2026-09-01 14:32:16 | `docs(audit): format all AI audit interactions with 4 mandatory fields (tool, time, prompt, output)` | Chuẩn hóa AI Audit |
| 17 | `0676979` | 2026-09-01 14:26:40 | `docs(audit): consolidate master AI audit report and separate initial prompts and correction iterations` | Master Audit Report |
| 16 | `bd5a377` | 2026-09-01 14:18:34 | `docs: complete final report, AI audit declarations, and AI critique` | Phase 10: Final Report |
| 15 | `3e4ce0a` | 2026-09-01 14:12:53 | `feat(skill): implement reusable AI-driven API test generator agent skill with design diagram and pseudocode` | Phase 9: Agent Skill |
| 14 | `99453f5` | 2026-09-01 14:09:18 | `docs(ci): record live GitHub Actions run URLs for pass and fail runs` | Phase 8: CI/CD Links |
| 13 | `3b3dad5` | 2026-09-01 14:08:16 | `ci: restore CI workflow to passing status (pipeline pass verification)` | Phase 8: CI Pass Demo |
| 12 | `cb67f1a` | 2026-09-01 14:03:12 | `ci: demonstrate automated failure detection with breaking regression test (pipeline fail demo)` | Phase 8: CI Fail Demo |
| 11 | `2c8ed15` | 2026-09-01 14:02:50 | `ci: setup GitHub Actions automated API testing pipeline (pipeline pass demo)` | Phase 8: CI Setup |
| 10 | `aa395b2` | 2026-09-01 13:51:10 | `docs(issues): create GitHub issue templates and log 13 confirmed bug reports` | Phase 7: GitHub Issues |
| 9 | `778d96c` | 2026-09-01 13:43:04 | `test(newman): consolidate full test suite execution and generate comprehensive HTML reports` | Phase 6: Newman Suite |
| 8 | `c491511` | 2026-09-01 13:37:57 | `feat(api-3): complete full testing pipeline and Newman execution for FR-14 Category CRUD` | Phase 5: API 3 CRUD |
| 7 | `4aee754` | 2026-09-01 13:09:49 | `docs(api-2): synchronize human extension count to 7 across test cases and AI audit log` | Phase 4: Sửa số lượng Ext |
| 6 | `4db4a6c` | 2026-09-01 13:07:59 | `fix(api-2): add concurrent checkout test case for overselling and negative stock verification` | Phase 4: Test Tương Tranh |
| 5 | `e8b2c37` | 2026-09-01 13:02:47 | `feat(api-2): complete full testing pipeline and Newman execution for FR-08 Checkout` | Phase 4: API 2 Checkout |
| 4 | `fea87e1` | 2026-09-01 12:53:55 | `feat(api-1): complete full testing pipeline and Newman execution for FR-02 Login` | Phase 3: API 1 Login |
| 3 | `8b10f9f` | 2026-09-01 12:29:34 | `docs: record API specification analysis and testing strategy for 3 APIs` | Phase 2: Chiến Lược |
| 2 | `79cb45b` | 2026-09-01 11:56:38 | `chore: configure SUT backend and Postman environment with X-Student-Id` | Phase 1: Môi Trường |
| 1 | `0826d1c` | 2026-09-01 11:50:56 | `chore: initialize project workspace and AI audit structure` | Phase 0: Khởi Tạo |
