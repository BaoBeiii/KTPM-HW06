# Nhật Ký AI Audit - Phiên 004: Pipeline Kiểm Thử API 2 (FR-08 Checkout) (Phase 4)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T13:00 -> 2026-09-01T13:20 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Thực hiện quy trình kiểm thử toàn diện cho API 2 (`POST /api/checkout`), kiểm toán 100% test cases do AI sinh ra, bổ sung các ca kiểm thử mở rộng và kịch bản tương tranh đặc biệt do người dùng chỉ đạo.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 4 cho API 2: FR-08 Thanh toán (POST /api/checkout). Cần kiểm thử luồng giỏ hàng liên hoàn, phòng thủ gian lận giá và thẩm định đầy đủ test cases."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- AI sinh ra 36 ca kiểm thử ban đầu (TC-B01 $\rightarrow$ TC-B36) bao gồm kiểm thử tham số và schema.
- Tuy nhiên AI chưa nhận diện được vấn đề tương tranh đơn hàng khi sản phẩm sắp hết và chưa thiết lập chuỗi nạp giỏ hàng động trong Postman.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Trong quá trình thực hiện Phase 4, người dùng đã trực tiếp đưa ra các chỉ đạo và phản hồi sâu sắc qua **5 khúc sửa cụ thể**:

### Khúc Sửa 1: Bổ sung kịch bản kiểm thử Tương tranh Bán vượt Tồn kho (Concurrency Race Condition)
- **Prompt Người Dùng (Correction Prompt 1 - Nguyên văn):**
  > *"checkout thêm tính năng khi số lượng còn 1 cho 2 người thanh toán cùng lúc với sản phẩm đó xem số lượng có bị về âm không"*
- **Hành động & Phản hồi của AI:**
  - Lập tức thiết kế ca kiểm thử mới: **TC-EXT-13: Concurrency Race Condition Checkout on Last In-Stock Item**.
  - Mô phỏng kịch bản 2 người dùng (User 1 và User 2) cùng có sản phẩm số lượng = 1 trong giỏ hàng và đồng thời gửi lệnh checkout.
  - Phân tích mã nguồn phát hiện lỗi nghiêm trọng: CSDL thiếu cột tồn kho `stock` và backend hoàn toàn không có cơ chế giao dịch khóa hàng (Database Locking/Transaction), dẫn tới cả 2 người đều mua thành công và tạo ra lỗi **BUG-09 (Overselling & Âm kho)**.
  - Tạo Git commit: `4db4a6c` — `fix(api-2): add concurrent checkout test case for overselling and negative stock verification`.

### Khúc Sửa 2: Sửa đổi và đồng bộ số lượng Ca kiểm thử mở rộng do Con người thực hiện
- **Prompt Người Dùng (Correction Prompt 2 - Nguyên văn):**
  > *"thế thì có 7 ca kiểm do con người làm á quên sửa rồi kìa"*
- **Hành động & Phản hồi của AI:**
  - AI rà soát lại toàn bộ hệ thống số liệu: Khi bổ sung `TC-EXT-13`, số lượng ca kiểm thử mở rộng của con người cho API 2 đã tăng từ 6 lên **7 ca kiểm thử**.
  - Lập tức cập nhật đồng bộ con số 7 trên mọi tệp tài liệu: `test_cases.md`, bảng tổng hợp số liệu, và AI Audit log.
  - Tạo Git commit: `4aee754` — `docs(api-2): synchronize human extension count to 7 across test cases and AI audit log`.

### Khúc Sửa 3: Hiệu chỉnh các ca kiểm thử Giá trị Tiền thanh toán Biên (TC-B17 & TC-B18)
- **Vấn đề phát hiện trong Audit:** AI ban đầu gộp chung kiểm tra tiền âm và tiền bằng 0 vào một ca kiểm thử, dẫn đến việc bỏ sót thông điệp lỗi cụ thể của backend.
- **Hành động hiệu chỉnh của AI:**
  - Tách bạch: TC-B17 chuyên kiểm thử số tiền âm (`total_amount: -50000`), TC-B18 chuyên kiểm thử số tiền bằng 0 (`total_amount: 0`).
  - Cả hai đều kỳ vọng mã lỗi `400 Bad Request`.

### Khúc Sửa 4: Thiết lập kịch bản bắt lỗi Price Tampering (BUG-05)
- **Yêu cầu phân tích:** Trong nghiệp vụ thương mại điện tử, backend bắt buộc phải tính toán lại tổng tiền từ giỏ hàng thực tế thay vì tin tưởng số tiền client gửi lên.
- **Hành động hiệu chỉnh của AI:**
  - Thiết kế kịch bản thêm sản phẩm 30,000,000 VND vào giỏ hàng nhưng cố ý gửi `total_amount: 1000` trong request checkout.
  - Assertions phát hiện backend chấp nhận đơn hàng 1,000 VND và trả về 200 OK $\rightarrow$ Xác nhận lỗi bảo mật nghiêm trọng **BUG-05 (Price Tampering)** tại dòng 297 của `server.js`.

### Khúc Sửa 5: Thiết lập chuỗi kiểm thử Bền vững Trạng thái Giỏ hàng (State Persistence)
- **Yêu cầu kiểm thử:** Kiểm tra ràng buộc "Sau khi thanh toán thành công, giỏ hàng được làm rỗng" theo đặc tả FR-08.
- **Hành động hiệu chỉnh của AI:**
  - Thiết lập chuỗi request Postman liên hoàn: `POST /api/cart` (Thêm hàng) $\rightarrow$ `POST /api/checkout` (Thanh toán) $\rightarrow$ `GET /api/cart` (Kiểm tra giỏ hàng rỗng).
  - Kết quả kiểm thử thực tế: Giỏ hàng vẫn còn nguyên các món hàng cũ $\rightarrow$ Xác nhận lỗi logic nghiệp vụ **BUG-06** tại dòng 305 của `server.js`.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.4 (Collaborate)** — Minh chứng rõ nét cho việc con người chủ động định hướng nghiệp vụ (chỉ đạo kiểm thử tương tranh và nhắc nhở sửa số liệu) để hoàn thiện bài toán kiểm thử mà AI không tự nghĩ ra được.
