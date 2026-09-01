# Nhật Ký AI Audit - Phiên 010: Báo Cáo Tổng Kết & Phản Biện AI (Phase 10)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T14:18 -> 2026-09-01T14:24 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Biên soạn báo cáo tổng kết toàn diện `REPORT.md`, viết đoạn nhận xét phản biện AI (AI Critique) đạt chuẩn độ dài 200–300 từ và lập tuyên bố sử dụng AI theo quy định của môn học.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 10: Biên soạn tài liệu REPORT.md tổng kết toàn bộ kết quả, viết đoạn phản biện AI Critique chuẩn 200–300 từ và lập tuyên bố sử dụng AI minh bạch."*

### Phản hồi & Thiết lập Ban đầu của AI (Initial AI Response):
- AI tổng hợp các bảng số liệu từ các phase trước.
- Soạn thảo cấu trúc tài liệu tổng kết `REPORT.md`.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Quá trình hoàn thiện báo cáo và phản biện AI được thực hiện qua **4 khúc hiệu chỉnh chi tiết**:

### Khúc Sửa 1: Cấu Trúc Hóa Báo Cáo Theo Chuẩn Đánh Giá Môn Học
- **Yêu cầu kỹ thuật:** Báo cáo phải bao quát từ thông tin sinh viên, đặc tả SUT, 3 API, chiến lược kiểm thử, số liệu thực thi, bảng tổng hợp 13 bug, bằng chứng CI/CD đến thiết kế Agent Skill.
- **Hành động hiệu chỉnh của AI:** Thiết kế `REPORT.md` thành 10 phần rõ ràng, tích hợp các liên kết điều hướng trực tiếp đến các tệp mã nguồn, báo cáo HTML và GitHub Issues.

### Khúc Sửa 2: Kiểm Soát Chặt Chẽ Dung Lượng Đoạn Phản Biện AI (AI Critique)
- **Yêu cầu của Rubric:** Phải viết một đoạn văn 200–300 từ trả lời trực diện 3 câu hỏi: AI sai ở đâu/thiếu sót gì? Tại sao AI bỏ sót? Bài học rút ra khi cộng tác là gì?
- **Hành động hiệu chỉnh của AI:** Soạn thảo đoạn văn phản biện phân tích 3 điểm yếu cốt lõi của AI (Stateless Testing Bias, Thiếu Business Defensive Logic, Thiếu nhận thức RBAC/Referential Integrity), đếm từ đạt **255 từ**, hoàn toàn nằm trong dải chuẩn 200–300 từ.

### Khúc Sửa 3: Tuyên Bố Sử Dụng AI Minh Bạch (AI Policy Declaration)
- **Yêu cầu học thuật:** Thực hiện đúng quy chế liêm chính học thuật đối với môn học áp dụng chính sách Open AI.
- **Hành động hiệu chỉnh của AI:** Ghi nhận tuyên bố: *"Tôi có sử dụng công cụ AI cho các tác vụ trong bài tập này"*, nêu rõ công cụ (Google Antigravity IDE / Gemini 3.7 Flash), thời gian, các tác vụ cụ thể và khẳng định trách nhiệm kiểm toán 100% của sinh viên.

### Khúc Sửa 4: Tích Hợp Đầy Đủ Bằng Chứng Chống Gian Lận (Anti-Cheat Evidence)
- **Yêu cầu của Rubric (Mục 11):** Bằng chứng thực thi không được phép tạo giả.
- **Hành động hiệu chỉnh của AI:** Trích dẫn tường minh các bằng chứng:
  - Header định danh: `X-Student-Id: 23127327` trong console log.
  - Hostname thực thi: `http://localhost:3000`.
  - Sơ đồ kiến trúc tự thiết kế trong `reports/agent_skill_design.md`.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.3 (Analyse) & G9.4 (Collaborate)** — Khả năng tự phê bình, đánh giá khách quan các giới hạn của mô hình ngôn ngữ lớn và khẳng định năng lực điều phối của kỹ sư phần mềm.
