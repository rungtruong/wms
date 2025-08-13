# TODO:

- [ ] update-tickets-service: Cập nhật tickets service để tự động tạo history entry khi ticket được tạo hoặc cập nhật (priority: High)
- [ ] create-ticket-history-model: Tạo model TicketHistory trong Prisma schema để lưu lịch sử thay đổi trạng thái (priority: High)
- [ ] create-migration: Tạo migration để thêm bảng ticket_history vào database (priority: High)
- [ ] create-history-endpoints: Tạo API endpoints để lấy lịch sử xử lý của ticket (priority: Medium)
- [ ] update-frontend-ui: Thay đổi UI frontend từ hiển thị comments sang hiển thị timeline lịch sử xử lý (priority: Medium)
- [ ] remove-comments-system: Loại bỏ hệ thống comments cũ khỏi codebase (priority: Low)
