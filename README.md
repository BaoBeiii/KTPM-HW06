# HW06 – API Testing (EShop SUT)

## 1. Thông Tin Sinh Viên
- **Họ và tên:** Lưu Ngô Quốc Bảo
- **Mã số sinh viên (MSSV):** 23127327
- **Môn học:** Kiểm thử phần mềm (Software Testing)
- **Giảng viên hướng dẫn:** TS. Lâm Quang Vũ, TS. Trần Duy Hoàng, ThS. Trần Thị Bích Hạnh, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh
- **Khoa:** Công nghệ Thông tin – Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM

---

## 2. Lựa Chọn 3 API Kiểm Thử

| Phân hệ (Pool) | Chức năng (Feature) | Endpoint | Phương thức | Trọng tâm kiểm thử |
| :--- | :--- | :--- | :---: | :--- |
| **Pool A** | **FR-02:** Đăng nhập & Khóa tài khoản | `/api/login` | `POST` | Xác thực JWT, validation email/mật khẩu, logic lockout 30s, SEC-01, SQLi |
| **Pool B** | **FR-08:** Đặt hàng (Checkout) | `/api/checkout` | `POST` | Phụ thuộc giỏ hàng, tính toán giá backend, xóa giỏ sau checkout, XSS, Price Tampering |
| **Pool C** | **FR-14:** Quản lý Danh mục (CRUD) | `/api/categories`<br>`/api/categories/:id` | `POST`<br>`GET`<br>`PUT`<br>`DELETE` | Phân quyền Admin RBAC (SEC-03, FR-12), vòng đời danh mục, validation tên danh mục |

---

## 3. Cấu Trúc Thư Mục Dự Án

```text
HW06/
├── 2026.HW06.API Testing_En.md    # Đề bài & Quy chế
├── 2026.HW06.API Testing_En.pdf    # Đề bài định dạng PDF
├── eshop-sut/                      # Mã nguồn hệ thống SUT (EShop)
├── ai-audit/                       # Nhật ký AI Audit liên tục
│   ├── api-01/                     # Nhật ký prompt cho API 1 (FR-02)
│   ├── api-02/                     # Nhật ký prompt cho API 2 (FR-08)
│   ├── api-03/                     # Nhật ký prompt cho API 3 (FR-14)
│   ├── agent-skill/                # Nhật ký prompt cho Agent Skill
│   ├── 000-planning-session.md     # Nhật ký phiên khởi tạo & lập kế hoạch
│   └── README.md                   # Hướng dẫn & cấu trúc AI Audit
├── collections/                    # Postman Collections & Environments
├── reports/                        # Báo cáo thực thi Newman HTML
├── screenshots/                    # Ảnh chụp bằng chứng console, Newman, bugs, CI/CD
├── README.md                       # Tài liệu tổng quan & Bảng tự đánh giá
└── ...
```

---

## 4. Bảng Tự Đánh Giá (Self-Assessment)

| STT | Tiêu chí đánh giá | Điểm tối đa | Điểm tự đánh giá |
| :---: | :--- | :---: | :---: |
| 1 | **API 1 (FR-02 Login):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | 30 |
| 2 | **API 2 (FR-08 Checkout):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | 30 |
| 3 | **API 3 (FR-14 Category CRUD):** Full pipeline (Generate $\ge 35$ + Audit + Extend $\ge 5$ + Execute + Bugs) | 30 | 30 |
| 4 | **Agent Skill:** Sơ đồ tự thiết kế + Mã giả (Pseudocode) + Triển khai generator | 10 | 10 |
| **Tổng cộng** | **Toàn bộ bài tập lớn HW06** | **100** | **100** |
