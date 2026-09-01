# Nhật Ký AI Audit - Phiên 002: Phân Tích Đặc Tả & Chiến Lược Kiểm Thử 3 API (Phase 2)

- **Công cụ AI:** Google Antigravity IDE (Gemini 3.7 Flash)
- **Thời gian:** 2026-09-01T12:26 -> 2026-09-01T12:28 (GMT+7)
- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo (MSSV: `23127327`)
- **Mục đích:** Nghiên cứu đối chiếu chi tiết tài liệu `api_specification.md` và `README.md` để xây dựng tài liệu phân tích kỹ thuật và chiến lược kiểm thử toàn diện cho 3 API: FR-02, FR-08, FR-14.

---

## 1. Prompt Yêu Cầu Ban Đầu (Initial Task Request Prompt)

### Prompt của Người Dùng:
> *"Đồng ý. Hãy tiến hành Phase 2: Phân tích chi tiết tài liệu đặc tả API và xây dựng tài liệu chiến lược kiểm thử toàn diện cho 3 API đã chọn."*

### Phản hồi & Đề xuất Ban đầu của AI (Initial AI Response):
- AI trích xuất sơ bộ danh sách endpoint:
  - Pool A: `POST /api/login`
  - Pool B: `POST /api/checkout`
  - Pool C: `GET, POST, PUT, DELETE /api/categories`
- Lập bảng phân tích tóm tắt các tham số đầu vào và đầu ra.

---

## 2. Các Khúc Sửa Đổi & Phản Hồi Từ Người Dùng (User Correction & Feedback Prompts)

Người dùng và định hướng đồ án đã yêu cầu hoàn thiện bản chiến lược qua **4 khúc hiệu chỉnh chuyên sâu**:

### Khúc Sửa 1: Phân định rạch ròi giữa Yêu cầu Tường minh và Giả định Kiểm thử
- **Yêu cầu phản biện:** AI thường nhầm lẫn giữa những gì SRS ghi rõ với những gì tester suy đoán. Cần tách bạch để tránh ngộ nhận lỗi sai của SUT.
- **Hành động điều chỉnh của AI:**
  - Thiết lập cấu trúc phân định 3 cột:
    1. *Yêu cầu tường minh (Explicit):* Trích xuất nguyên văn từ `api_specification.md` (ví dụ: lockout 30 giây khi sai $\ge 3$ lần).
    2. *Giả định kiểm thử (Assumptions):* Quy ước chuẩn công nghiệp (ví dụ: email case-insensitive theo RFC 5321, giỏ hàng phải bị làm rỗng sau khi thanh toán).
    3. *Điểm chưa xác định (Unknowns):* Các tình huống chưa nêu rõ trong tài liệu (ví dụ: giới hạn số lượng danh mục tối đa).

### Khúc Sửa 2: Thiết lập Ma trận Ánh xạ An ninh Toàn diện (SEC-01 $\rightarrow$ SEC-07)
- **Yêu cầu phản biện:** Bản phác thảo ban đầu của AI thiếu việc ánh xạ các điều khoản an ninh trong SRS vào từng endpoint.
- **Hành động điều chỉnh của AI:**
  - Gắn nhãn cụ thể:
    - `POST /api/login` $\rightarrow$ Phải tuân thủ SEC-01 (không để lộ mật khẩu), SEC-05 (chống SQL Injection), Rate Limiting.
    - `POST /api/checkout` $\rightarrow$ Phải tuân thủ SEC-02 (xác thực token), SEC-04 (Stored XSS trong địa chỉ giao hàng), Phòng thủ gian lận giá (Price Tampering).
    - `CRUD /api/categories` $\rightarrow$ Phải tuân thủ SEC-03 / FR-12 (Broken Function Level Authorization - BFLA, chỉ Admin mới được tạo/sửa/xóa).

### Khúc Sửa 3: Chuẩn hóa 5 Kỹ thuật Kiểm thử Hộp Đen Bắt buộc
- **Yêu cầu phản biện:** Đảm bảo bao phủ toàn diện theo đúng chuẩn kiểm thử phần mềm đại học.
- **Hành động điều chỉnh của AI:**
  - Cấu trúc tài liệu `api_testing_strategy.md` bắt buộc áp dụng 5 kỹ thuật:
    1. Equivalence Partitioning (EP)
    2. Boundary Value Analysis (BVA)
    3. State Transition Testing (FSM)
    4. Security Injection Matrix (SEC)
    5. JSON Schema Validation

### Khúc Sửa 4: Thiết lập Hạn mức Số lượng Ca Kiểm thử và Cam kết 100% Audit
- **Yêu cầu phản biện:** Tránh tình trạng sinh hời hợt hoặc thiếu số lượng theo yêu cầu đề tài ($\ge 35$ AI tests, $\ge 5$ extensions).
- **Hành động điều chỉnh của AI:**
  - Quy định mục tiêu: Mỗi API có tối thiểu 40 test cases (Toàn suite $\ge 120$ test cases).
  - Cam kết 100% các ca kiểm thử do AI sinh đều phải được con người thẩm định và gắn nhãn: `VALID`, `INVALID`, hoặc `INCOMPLETE` kèm lý do kỹ thuật.

---

## 3. Đánh Giá Năng Lực Bloom-AI (Competency Assessment)
- **Mức độ đạt được:** **G9.3 (Analyse)** — Phân tích thấu đáo cấu trúc hệ thống, bóc tách các ràng buộc tiềm ẩn và thiết lập khung chiến lược kiểm thử vững chắc.
