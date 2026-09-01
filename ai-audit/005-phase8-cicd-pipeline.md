# Nhật Ký AI Audit - Phiên 008: Xây Dựng CI/CD Pipeline Với GitHub Actions (Phase 8)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T14:02 -> 2026-09-01T14:10 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Xây dựng quy trình tự động hóa kiểm thử liên tục (CI/CD Pipeline) bằng GitHub Actions, đáp ứng yêu cầu minh chứng 2 commit đối chứng: 1 commit chạy Pass và 1 commit cố ý làm Fail để kiểm tra năng lực bắt lỗi tự động.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 8: Xây dựng pipeline CI/CD GitHub Actions chạy Newman tự động, xuất báo cáo artifact và thực hiện đúng yêu cầu 2 commit: 1 commit pipeline Pass và 1 commit pipeline Fail."*

### Phản hồi & Thiết lập Ban đầu của AI (Initial AI Response):
- Tạo tệp cấu hình `.github/workflows/api-testing.yml` trên nền tảng Ubuntu runner.
- Cấu hình các lệnh chạy kiểm thử trong `package.json`.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Quá trình tích hợp và kiểm thử CI/CD đã trải qua **4 khúc hiệu chỉnh và xử lý sự cố quan trọng**:

### Khúc Sửa 1: Thiết kế Cơ chế 2 Lệnh Kiểm thử Riêng biệt trong package.json
- **Yêu cầu kỹ thuật:** Cần có cơ chế chuyển đổi rõ ràng giữa kịch bản chạy thành công (Pass) và kịch bản phát hiện lỗi hồi quy (Fail).
- **Hành động hiệu chỉnh của AI:** Thêm vào `package.json`:
  - `"test:ci:pass"`: Chạy kiểm thử Health Check & Connectivity $\rightarrow$ Đạt 100% Pass (Exit code 0).
  - `"test:ci:fail"`: Chạy kiểm thử trên phân hệ Checkout có lỗi nghiệp vụ (Price Tampering) $\rightarrow$ Bị Fail (Exit code 1).

### Khúc Sửa 2: Khắc phục Sự cố "Chưa Thấy Commit Pass Trên CI/CD"
- **Prompt Người Dùng (Correction Prompt - Nguyên văn):**
  > *"chưa thấy được commit là pass ci cd hết á"*
- **Phân tích nguyên nhân kỹ thuật:** Do ở lượt push trước, cả commit Pass và commit Fail được đẩy lên cùng một lượt lệnh `git push`. GitHub Actions theo cơ chế mặc định chỉ kích hoạt workflow cho commit mới nhất tại đỉnh nhánh (lúc đó là commit Fail `cb67f1a`), dẫn đến việc trên giao diện GitHub Actions chỉ thấy duy nhất 1 run màu đỏ và người dùng chưa thấy được run màu xanh lá (Pass).
- **Hành động điều chỉnh của AI:**
  - Lập tức khôi phục lệnh test trong workflow về `npm run test:ci:pass`.
  - Tạo commit mới: `3b3dad5` — `ci: restore CI workflow to passing status (pipeline pass verification)`.
  - Thực hiện lệnh `git push origin main` đẩy trực tiếp lên GitHub.
  - Kết quả: GitHub Actions lập tức kích hoạt Run #33480707803 và hoàn thành thành công với trạng thái **SUCCESS ✅ (màu xanh lá)** sau 26 giây.

### Khúc Sửa 3: Hoàn thiện Báo cáo Minh chứng Hai Trạng thái Đối chứng
- **Yêu cầu của Rubric:** Phải cung cấp đường dẫn và ảnh chụp chứng minh rõ ràng cả 2 lượt chạy trên GitHub Actions.
- **Hành động hiệu chỉnh của AI:** Ghi nhận trực tiếp vào `reports/ci_cd_report.md`:
  - **Run Success ✅:** [Run #33480707803](https://github.com/BaoBeiii/KTPM-HW06/actions/runs/33480707803) (Commit `3b3dad5`).
  - **Run Failure ❌:** [Run #33480450283](https://github.com/BaoBeiii/KTPM-HW06/actions/runs/33480450283) (Commit `cb67f1a`).

### Khúc Sửa 4: Tự Động Thu Thập Báo Cáo Artifact Dù Pipeline Pass hay Fail
- **Yêu cầu quản trị:** Dù kiểm thử có phát hiện lỗi và dừng pipeline, tester vẫn cần tải được báo cáo HTML để phân tích.
- **Hành động hiệu chỉnh của AI:** Cấu hình điều kiện `if: always()` cho action `actions/upload-artifact@v4`, đảm bảo báo cáo Newman HTML luôn được đóng gói và lưu trữ 14 ngày trên GitHub.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.4 (Collaborate)** — Phối hợp xử lý nhanh chóng phản hồi thực tế của người dùng đối với hành vi của nền tảng GitHub Actions, hoàn thành trọn vẹn chỉ tiêu 2 trạng thái Pass/Fail của bài tập.
