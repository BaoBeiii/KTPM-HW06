# Nhật Ký AI Audit - Phiên 000: Phân Tích Đề Bài & Thiết Lập Kế Hoạch

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31T22:30 -> 2026-09-01T11:45 (GMT+7)
- **Mục đích:** Đọc hiểu đề bài HW06, khảo sát SUT EShop, thống nhất 3 API, xây dựng kế hoạch kiểm thử theo mô hình Quality Gate và quy định kiểm duyệt nghiêm ngặt từng phase.

---

## 1. Nội dung Tương tác Chính

### Tương tác 1: Lựa chọn 3 API
- **User Prompt:** Người dùng chọn FR-02 (Pool A), FR-08 (Pool B), FR-14 (Pool C).
- **AI Analysis:** Phân tích đặc tả kỹ thuật trong `api_specification.md` và mã nguồn `server.js`, `database.js` của SUT:
  - FR-02: `POST /api/login` (Authentication, Lockout 30s, Password hashing SEC-01, SQLi).
  - FR-08: `POST /api/checkout` (Cart dependency, Price calculation, XSS SEC-04, Price Tampering).
  - FR-14: `POST/GET/PUT/DELETE /api/categories` (Category CRUD, RBAC SEC-03 `role = 'admin'`).
- **Human Review:** Sinh viên chốt chính thức 3 API trên.

### Tương tác 2: Kiến trúc và Vị trí của Agent Skill
- **Thảo luận:** Sinh viên phân tích không nên đưa Agent Skill lên làm trước khi chưa kiểm thử API thực tế. Agent Skill nên là kết quả tổng quát hóa (abstraction) sau khi đã thực thi kiểm thử trên 3 API. Kiến trúc 12 tầng là đề xuất tự thiết kế của sinh viên, không phải quy định bắt buộc của đề bài. Video demo YouTube là nội dung khuyến khích (encouraged), không phải điều kiện chặn bắt buộc.
- **Human Action:** AI đồng ý 100% và điều chỉnh lại workflow: chuyển Agent Skill xuống Phase 9.

### Tương tác 3: Nguyên tắc Thực nghiệm và Checkpoint Quality Gate
- **Thảo luận:** Không dự đoán trước bug (Bug-01, Bug-02,...) hay hard-code số lượng test case khi chưa chạy thực tế. Định dạng bảng test case và summary là Markdown (`.md`).
- **Quy tắc Kiểm duyệt:**
  - Hoàn thành mỗi Phase $\rightarrow$ Tạo ngay 1 Git commit cho Phase đó.
  - Dừng lại tại Quality Gate chờ Người dùng kiểm tra và duyệt.
  - Nếu duyệt: Chuyển sang Phase kế tiếp.
  - Nếu yêu cầu sửa/chưa duyệt: Sửa đổi $\rightarrow$ Tạo commit sửa lỗi (`fix:`, `refactor:`, `docs:`) $\rightarrow$ Dừng lại chờ duyệt lại.

---

## 2. Kết quả Đạt được (Deliverables of Phase 0)
- Bản kế hoạch toàn diện `implementation_plan.md` đạt chuẩn Rubric.
- Khởi tạo thư mục dự án và hệ thống AI Audit Log liên tục.
