# Nhật Ký AI Audit - Phiên 000: Phân Tích Đề Bài & Thiết Lập Kế Hoạch (Phase 0)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-08-31T22:30 -> 2026-09-01T11:45 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Khảo sát đề bài HW06, phân tích đặc tả SUT EShop, thống nhất 3 API, xây dựng kế hoạch kiểm thử theo mô hình Quality Gate và quy định kiểm duyệt nghiêm ngặt từng phase.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Tôi cần lập kế hoạch thực hiện đồ án HW06 - API Testing trên hệ thống EShop SUT theo đúng rubric của giảng viên. Hãy khảo sát kho mã nguồn và đề xuất kế hoạch chi tiết."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- AI đọc đề bài và sinh bản kế hoạch ban đầu 11 phases.
- Tuy nhiên bản kế hoạch ban đầu của AI mắc một số điểm giả định trước:
  - Dự đoán trước các mã bug (`BUG-01`, `BUG-02`) trước khi thực nghiệm.
  - Áp đặt việc làm video YouTube là điều kiện bắt buộc thay vì khuyến khích.
  - Chọn API Pool C là FR-18 (Admin Order) thay vì API CRUD chuẩn.
  - Chưa có cơ chế chốt kiểm duyệt (Quality Gate) giữa người dùng và AI.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Người dùng đã trực tiếp phản biện và yêu cầu điều chỉnh qua **5 khúc sửa cụ thể**:

### Khúc Sửa 1: Phản biện nguyên tắc thực nghiệm và loại bỏ ràng buộc tự tạo
- **Prompt Người Dùng (Correction Prompt 1):**
  > *"Sửa kế hoạch như này. Mình đã đọc toàn bộ kế hoạch của bạn. Nhìn tổng thể, kế hoạch hiện tại khá tốt về mặt workflow... Tuy nhiên, có một số điểm nguy hiểm: bạn đang xác định trước một số bug, số lượng test, hành vi SUT và cả việc YouTube là điều kiện bắt buộc, trong khi những thứ đó phải được thực nghiệm rồi mới kết luận..."*
- **Hành động & Phản hồi của AI:** 
  - AI tiếp thu 100%, xóa bỏ toàn bộ các giả định kết luận trước về bug.
  - Chuyển số lượng test case từ con số cứng nhắc thành chỉ tiêu định hướng ($\ge 35$ AI tests, $\ge 5$ human extensions).
  - Điều chỉnh video YouTube thành mục khuyến khích mở rộng theo đúng câu chữ của rubric.

### Khúc Sửa 2: Điều chỉnh API đại diện cho Pool C
- **Prompt Người Dùng (Correction Prompt 2):**
  > *"sửa kế hoạch Pool C chọn FR-14 đi"*
- **Hành động & Phản hồi của AI:**
  - Cập nhật toàn bộ kế hoạch: Chọn chính thức **FR-14: Quản lý danh mục sản phẩm (Category CRUD)** cho Pool C.
  - Phân tích kỹ thuật các endpoint của FR-14: `POST/GET/PUT/DELETE /api/categories` và các yêu cầu bảo mật phân quyền Admin (FR-12 & SEC-03).

### Khúc Sửa 3: Thiết lập quy chế kiểm duyệt Quality Gate bắt buộc
- **Prompt Người Dùng (Correction Prompt 3):**
  > *"Thêm vào kế hoạch là mỗi phase phải qua kiểm duyệt của tôi thì mới được qua phase tiếp theo. Nếu tôi không duyệt thì quay lại sửa rồi đợt tôi duyệt lại mới được qua phase kế tiếp"*
- **Hành động & Phản hồi của AI:**
  - Đưa cơ chế **Quality Gate (Gate 0 $\rightarrow$ Gate 11)** vào làm nguyên tắc vận hành cốt lõi.
  - Sau mỗi phase, AI bắt buộc phải dừng lại, báo cáo kết quả và chờ lệnh phê duyệt ("Đồng ý") của người dùng mới được thực hiện phase tiếp theo.

### Khúc Sửa 4: Quy định chính sách Git Commit theo từng Phase
- **Prompt Người Dùng (Correction Prompt 4):**
  > *"Thêm kế hoạch về cách commit thì cứ xong 1 phase là 1 commit không cần phải được duyệt mới được commit. Khi có sửa lỗi ở phase đó thì có thêm commit sửa lỗi thôi."*
- **Hành động & Phản hồi của AI:**
  - Chuẩn hóa quy tắc commit: Mỗi khi hoàn tất công việc của 1 phase, tạo ngay 1 commit theo chuẩn Conventional Commits (`feat:`, `chore:`, `docs:`, `test:`).
  - Nếu người dùng yêu cầu sửa lỗi ở phase đó, tạo thêm commit sửa đổi riêng biệt (`fix:`).

### Khúc Sửa 5: Cung cấp thông tin định danh sinh viên
- **Prompt Người Dùng (Correction Prompt 5):**
  > *"Mã số sinh viên: 23127327, Họ tên: Lưu Ngô Quốc Bảo"*
- **Hành động & Phản hồi của AI:**
  - Ghi nhận thông tin định danh vào biến môi trường toàn cục, cấu hình header chống gian lận `X-Student-Id: 23127327` cho toàn bộ các kịch bản kiểm thử Postman.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.4 (Collaborate)** — Người dùng đóng vai trò kiến trúc sư trưởng (Lead Architect), trực tiếp hiệu chỉnh, định hướng và giám sát nghiêm ngặt kế hoạch của AI, loại bỏ các thiên lệch giả định trước của mô hình.
