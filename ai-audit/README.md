# AI Audit Log - HW06 API Testing

- **Sinh viên thực hiện:** Lưu Ngô Quốc Bảo
- **Mã số sinh viên:** 23127327
- **Môn học:** Kiểm thử phần mềm (Software Testing)
- **Hệ thống kiểm thử (SUT):** EShop API Backend
- **Chính sách AI:** Tuân thủ chuẩn Bloom-AI (G9.2 -> G9.5), ghi nhận minh bạch và đầy đủ 100% tương tác với AI.

---

## Cấu trúc Lưu trữ Nhật ký AI Audit

```text
ai-audit/
├── api-01/          # Nhật ký tương tác cho API 1 (FR-02 Login)
├── api-02/          # Nhật ký tương tác cho API 2 (FR-08 Checkout)
├── api-03/          # Nhật ký tương tác cho API 3 (FR-14 Category CRUD)
└── agent-skill/     # Nhật ký thiết kế và triển khai Agent Skill
```

Mỗi phiên tương tác ghi lại đầy đủ:
1. **Công cụ AI (AI Tool):** Tên công cụ / Model
2. **Thời gian (Timestamp):** Ngày giờ thực hiện
3. **Mục đích (Purpose):** Nhiệm vụ cụ thể
4. **Câu lệnh (Prompt):** Prompt chi tiết gửi cho AI
5. **Phản hồi của AI (AI Response):** Nội dung AI sinh ra
6. **Thẩm định của con người (Human Review & Action):** Đánh giá, chỉnh sửa và quyết định của sinh viên.
