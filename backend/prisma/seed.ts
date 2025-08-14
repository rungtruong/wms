import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  console.log('Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Manager User',
        role: 'manager',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'tech@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Technician User',
        role: 'technician',
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create contracts
  console.log('Creating contracts...');
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        contractNumber: 'WMS-2024-001',
        customerName: 'Công ty TNHH ABC',
        customerEmail: 'contact@abc.com',
        customerPhone: '0123456789',
        customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        termsConditions: 'Bảo hành 24 tháng cho tất cả sản phẩm',
        status: 'active',
        createdBy: users[0].id,
      },
    }),
    prisma.contract.create({
      data: {
        contractNumber: 'WMS-2024-002',
        customerName: 'Công ty XYZ',
        customerEmail: 'info@xyz.com',
        customerPhone: '0987654321',
        customerAddress: '456 Đường XYZ, Quận 3, TP.HCM',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-01-31'),
        termsConditions: 'Bảo hành 12 tháng cho sản phẩm điện tử',
        status: 'active',
        createdBy: users[1].id,
      },
    }),
    prisma.contract.create({
      data: {
        contractNumber: 'WMS-2023-015',
        customerName: 'Công ty DEF',
        customerEmail: 'support@def.com',
        customerPhone: '0369852147',
        customerAddress: '789 Đường DEF, Quận 7, TP.HCM',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-05-31'),
        termsConditions: 'Bảo hành 18 tháng',
        status: 'expired',
        createdBy: users[0].id,
      },
    }),
  ]);

  console.log(`Created ${contracts.length} contracts`);

  // Create product serials
  console.log('Creating product serials...');
  const productSerials = await Promise.all([
    prisma.productSerial.create({
      data: {
        serialNumber: 'SN001234567890',
        name: 'Máy in laser HP LaserJet Pro',
        model: 'HP-LJ-P3015',
        category: 'Printer',
        description: 'Máy in laser đen trắng tốc độ cao',
        warrantyMonths: 24,
        contractId: contracts[0].id,
        manufactureDate: new Date('2024-01-15'),
        purchaseDate: new Date('2024-02-01'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Sản phẩm mới, chưa sử dụng',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'SN002345678901',
        name: 'Laptop Dell Inspiron 15',
        model: 'DELL-INS-15-3000',
        category: 'Laptop',
        description: 'Laptop văn phòng cấu hình cơ bản',
        warrantyMonths: 12,
        contractId: contracts[1].id,
        manufactureDate: new Date('2024-01-20'),
        purchaseDate: new Date('2024-02-15'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Đã cài đặt phần mềm cơ bản',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'SN003456789012',
        name: 'Máy photocopy Canon IR2525',
        model: 'CANON-IR-2525',
        category: 'Copier',
        description: 'Máy photocopy đa chức năng',
        warrantyMonths: 18,
        contractId: contracts[0].id,
        manufactureDate: new Date('2023-12-10'),
        purchaseDate: new Date('2024-01-05'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Đã bảo trì định kỳ',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'SN004567890123',
        name: 'Máy tính để bàn HP EliteDesk',
        model: 'HP-ED-800-G5',
        category: 'Desktop',
        description: 'Máy tính để bàn hiệu năng cao',
        warrantyMonths: 12,
        contractId: contracts[2].id,
        manufactureDate: new Date('2023-05-15'),
        purchaseDate: new Date('2023-06-01'),
        warrantyStatus: 'expired',
        isActive: true,
        notes: 'Hết bảo hành, cần gia hạn',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'DL15-2024-001234',
        name: 'Máy in Dell Laser 1234',
        model: 'DL15-2024',
        category: 'Printer',
        description: 'Máy in laser Dell hiệu năng cao',
        warrantyMonths: 24,
        contractId: contracts[0].id,
        manufactureDate: new Date('2024-01-10'),
        purchaseDate: new Date('2024-01-25'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Sản phẩm mới, đang trong thời gian bảo hành',
      },
    }),
  ]);

  console.log(`Created ${productSerials.length} product serials`);

  // Create tickets
  console.log('Creating tickets...');
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-001',
        productSerialId: productSerials[0].id,
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@abc.com',
        customerPhone: '0123456789',
        issueDescription: 'Máy in không nhận giấy, báo lỗi paper jam',
        issueTitle: 'Lỗi kẹt giấy máy in',
        priority: 'medium',
        status: 'received',
        assignedTo: users[2].id,
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-002',
        productSerialId: productSerials[1].id,
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@xyz.com',
        customerPhone: '0987654321',
        issueDescription: 'Laptop không khởi động được, màn hình đen',
        issueTitle: 'Laptop không khởi động',
        priority: 'high',
        status: 'in_progress',
        assignedTo: users[2].id,
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-003',
        productSerialId: productSerials[2].id,
        customerName: 'Lê Văn C',
        customerEmail: 'levanc@abc.com',
        customerPhone: '0369852147',
        issueDescription: 'Máy photocopy in mờ, cần thay mực',
        issueTitle: 'Máy photocopy in mờ',
        priority: 'low',
        status: 'resolved',
        assignedTo: users[2].id,
        resolvedAt: new Date('2024-12-15T10:30:00Z'),
      },
    }),
  ]);

  console.log(`Created ${tickets.length} tickets`);

  // Create ticket history
  console.log('Creating ticket history...');
  await Promise.all([
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[0].id,
        performedBy: users[2].id,
        actionType: 'updated',
        description: 'Đã kiểm tra máy in, phát hiện giấy bị kẹt trong khay số 2',
        oldValue: null,
        newValue: null,
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[1].id,
        performedBy: users[2].id,
        actionType: 'status_changed',
        description: 'Chuyển trạng thái từ received sang in_progress',
        oldValue: 'received',
        newValue: 'in_progress',
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[2].id,
        performedBy: users[2].id,
        actionType: 'status_changed',
        description: 'Đã thay mực mới và vệ sinh máy, hoạt động bình thường',
        oldValue: 'in_progress',
        newValue: 'resolved',
      },
    }),
  ]);

  console.log('Created ticket history');

  // Create warranty history
  console.log('Creating warranty history...');
  await Promise.all([
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[0].id,
        actionType: 'created',
        description: 'Sản phẩm được đưa vào bảo hành',
        performedBy: users[0].id,
        performedAt: new Date('2024-02-01T09:00:00Z'),
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[2].id,
        actionType: 'updated',
        description: 'Thay thế bộ phận drum unit',
        cost: 1500000,
        performedBy: users[2].id,
        performedAt: new Date('2024-12-15T14:30:00Z'),
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[3].id,
        actionType: 'status_changed',
        description: 'Hết hạn bảo hành',
        performedBy: users[1].id,
        performedAt: new Date('2024-06-01T00:00:00Z'),
      },
    }),
  ]);

  console.log('Created warranty history');

  // Create notifications
  console.log('Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'warning',
        title: 'Sản phẩm sắp hết bảo hành',
        message: 'Máy tính để bàn HP EliteDesk (SN004567890123) sẽ hết bảo hành trong 30 ngày',
        userId: users[1].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'info',
        title: 'Ticket mới được tạo',
        message: 'Ticket TK-2024-001 đã được tạo cho máy in HP LaserJet Pro',
        userId: users[2].id,
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'success',
        title: 'Ticket đã được giải quyết',
        message: 'Ticket TK-2024-003 đã được giải quyết thành công',
        userId: users[0].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'error',
        title: 'Lỗi hệ thống',
        message: 'Không thể kết nối đến máy chủ email',
        userId: users[0].id,
        read: false,
      },
    }),
  ]);

  console.log('Created notifications');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });