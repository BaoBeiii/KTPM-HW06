# Nhật Ký AI Audit - Phiên 007: Chuẩn Hóa GitHub Issues & Mẫu Báo Cáo Lỗi (Phase 7)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T13:50 -> 2026-09-01T13:52 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Xây dựng hệ thống mẫu báo cáo lỗi GitHub Issue Template chuẩn hóa theo tiêu chuẩn công nghiệp và lập hồ sơ 13 lỗi thực tế đã xác nhận của SUT EShop.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 7: Chuẩn hóa GitHub Issue Template, tạo thư mục issues/ chứa đầy đủ 13 bug report độc lập và tạo script tự động sinh."*

### Phản hồi & Thực thi Ban đầu của AI (Initial AI Response):
- AI tạo tệp template ban đầu cho GitHub.
- Lên danh sách 13 bug cần chuyển đổi thành format issue.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Quá trình chuẩn hóa và kết xuất 13 báo cáo lỗi được thực hiện qua **4 khúc hoàn thiện cụ thể**:

### Khúc Sửa 1: Chuẩn hóa Tiêu chuẩn Mẫu Báo Cáo Lỗi (Bug Report Template)
- **Yêu cầu kỹ thuật:** Báo cáo lỗi phải theo đúng tiêu chuẩn công nghiệp (IEEE 829 / GitHub Best Practices) để thuận tiện cho đội ngũ phát triển sửa lỗi.
- **Hành động hiệu chỉnh của AI:** Tạo `.github/ISSUE_TEMPLATE/bug_report.md` với đầy đủ 7 trường thông tin: Tiêu đề chuẩn hóa `[BUG][<SEVERITY>][<API>]`, Metadata sinh viên & mã lỗi, Mô tả chi tiết, Các bước tái hiện (Steps to Reproduce kèm curl request), Kết quả thực tế, Kết quả mong đợi, Phân tích nguyên nhân kỹ thuật và Đề xuất bản vá Code Diff.

### Khúc Sửa 2: Khóa Tạo Issue Trống và Điều Hướng Hỗ Trợ
- **Yêu cầu quản trị:** Ngăn chặn việc người dùng tạo các issue không theo khuôn mẫu trên GitHub repository.
- **Hành động hiệu chỉnh của AI:** Tạo `.github/ISSUE_TEMPLATE/config.yml` với cấu hình `blank_issues_enabled: false`, đính kèm các liên kết hữu ích dẫn đến tài liệu chiến lược kiểm thử và báo cáo Newman tổng hợp.

### Khúc Sửa 3: Tự Động Hóa Kết Xuất 13 Tệp Issue Độc Lập
- **Yêu cầu tự động hóa:** Thay vì sao chép thủ công dễ phát sinh sai sót, xây dựng công cụ trích xuất tự động.
- **Hành động hiệu chỉnh của AI:** Viết script `scripts/generate_issue_files.js` đọc dữ liệu cấu trúc 13 lỗi và xuất ra 13 tệp Markdown chuẩn hóa (`issues/ISSUE-01-...md` $\rightarrow$ `issues/ISSUE-13-...md`).

### Khúc Sửa 4: Xây dựng Tệp Chỉ Mục Quản Lý (Index README)
- **Yêu cầu trình bày:** Tạo trang tổng quan giúp người chấm và lập trình viên dễ dàng điều hướng giữa 13 lỗi.
- **Hành động hiệu chỉnh của AI:** Tự động sinh `issues/README.md` với bảng tổng hợp phân loại theo: Mã lỗi, Tên lỗi, API ảnh hưởng, Mức độ nghiêm trọng (Critical/Major/Medium), Nhãn dán (Labels) và Liên kết trực tiếp đến từng file issue.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.2 (Apply) & G9.4 (Collaborate)** — Áp dụng các quy chuẩn quản lý dự án phần mềm chuyên nghiệp trên GitHub, tự động hóa quy trình xuất bản dữ liệu kiểm thử.
