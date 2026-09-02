# Nhật Ký AI Audit - Phiên 009: Thiết Kế Agent Skill Tự Động Sinh Test Cases (Phase 9)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T14:12 -> 2026-09-01T14:15 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Thiết kế và cài đặt một Agent Skill hoàn chỉnh có khả năng phân tích đặc tả API và tự động sinh ra bộ sưu tập Postman Collection có assertions kiểm thử tự động, đáp ứng cấp độ Bloom-AI G9.5 (Create).
- **Video Minh Họa Demo (YouTube):** [https://youtu.be/-BG54YRyEqk](https://youtu.be/-BG54YRyEqk)


---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 9: Thiết kế Agent Skill tự động sinh test cases từ đặc tả API (Bloom-AI G9.5 - Create), vẽ sơ đồ kiến trúc tự thiết kế, viết mã giả thuật toán và cài đặt mã nguồn thực thi."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- Lên ý tưởng kiến trúc tổng quát hóa quy trình kiểm thử từ 3 API trước đó.
- Tạo khung thư mục `.agents/skills/api-test-generator/`.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Quá trình thiết kế và hiện thực hóa Agent Skill được hoàn thiện qua **4 khúc tinh chỉnh cụ thể**:

### Khúc Sửa 1: Chuẩn hóa Định dạng Agent Skill (SKILL.md)
- **Yêu cầu kỹ thuật:** Cần tuân thủ cấu trúc Agent Skill chuẩn công nghiệp của Google Antigravity để có thể tái sử dụng cho các dự án kiểm thử RESTful API khác.
- **Hành động hiệu chỉnh của AI:** Tạo `.agents/skills/api-test-generator/SKILL.md` với YAML frontmatter (`name`, `description`, `version`, `author`) và tài liệu hướng dẫn 5 phân tầng kỹ thuật rõ ràng.

### Khúc Sửa 2: Thiết Kế Sơ Đồ Kiến Trúc Tự Vẽ (Self-Drawn Architecture Diagram)
- **Yêu cầu của Rubric:** Sơ đồ phải do sinh viên tự thiết kế kiến trúc, không dùng sơ đồ do AI tạo sẵn một cách thụ động.
- **Hành động hiệu chỉnh của AI:** Thiết kế mô hình kiến trúc Module 5 tầng (Input Layer $\rightarrow$ Spec Parser $\rightarrow$ 4-Pass Generator Pipeline $\rightarrow$ Postman Assembler $\rightarrow$ Output Artifacts) và Sơ đồ tương tác tuần tự Mermaid chi tiết trong `reports/agent_skill_design.md`.

### Khúc Sửa 3: Trình bày Mã Giả Thuật Toán Chi Tiết (Algorithmic Pseudocode)
- **Yêu cầu học thuật:** Mã giả phải thể hiện rõ ràng luồng dữ liệu, tham số đầu vào, điều kiện rẽ nhánh và cơ chế tự động tiêm mã chống gian lận.
- **Hành động hiệu chỉnh của AI:** Xây dựng 2 khối thuật toán `ALGORITHM GenerateApiTestSuite` và `ALGORITHM RunApiTestGeneratorSkill` với định dạng khối có cấu trúc, duyệt qua từng endpoint để sinh phân vùng biên, vòng đời FSM, ma trận tấn công OWASP và kiểm định schema.

### Khúc Sửa 4: Sửa Lỗi Đường Dẫn Thực Thi Của CLI Script Generator
- **Vấn đề phát sinh (Bug & Issue):** Khi chạy `node .agents/skills/api-test-generator/scripts/generator.js` lần đầu, đường dẫn `outputPath` bị nối chuỗi tương đối sai dẫn tới lỗi `ENOENT: no such file or directory`.
- **Hành động hiệu chỉnh của AI:**
  - Sửa đổi dòng 16 trong `generator.js`: Thay thế đường dẫn tương đối bằng `path.resolve(process.cwd(), 'collections/Generated_Collection.json')`.
  - Chạy lại kiểm thử CLI: Script thực thi thành công 100%, tự động tạo và xuất tệp `collections/Generated_Collection.json` có gắn sẵn Pre-request Script `X-Student-Id: 23127327`.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.5 (Create)** — Đạt cấp độ sáng tạo cao nhất của thang đo Bloom-AI: Đóng gói toàn bộ tri thức kiểm thử thành một công cụ Agent Skill có thể tái sử dụng độc lập.
