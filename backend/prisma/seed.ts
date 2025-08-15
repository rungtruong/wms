import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'password123';
const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting database seeding...');

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  console.log('Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Forest Trương',
        role: 'admin',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Đỗ Quốc Vương',
        role: 'manager',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'tech1@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Nguyễn Lý Duy Quang',
        role: 'technician',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'tech2@wms.com',
        passwordHash: hashedPassword,
        fullName: 'Nguyễn Trần Hải Vương',
        role: 'technician',
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  console.log('Creating contracts...');
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        contractNumber: 'HD-2024-001',
        customerName: 'Công ty TNHH Công nghệ Viettel',
        customerEmail: 'procurement@viettel.com.vn',
        customerPhone: '024-3555-0000',
        customerAddress: '285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2026-01-14'),
        termsConditions: 'Bảo hành toàn diện 24 tháng, hỗ trợ kỹ thuật 24/7, thay thế miễn phí trong 30 ngày đầu',
        status: 'active',
        createdBy: users[0].id,
      },
    }),
    prisma.contract.create({
      data: {
        contractNumber: 'HD-2024-002',
        customerName: 'Ngân hàng TMCP Techcombank',
        customerEmail: 'it.support@techcombank.com.vn',
        customerPhone: '1900-588-822',
        customerAddress: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        termsConditions: 'Bảo hành 12 tháng, bảo trì định kỳ hàng quý, hỗ trợ onsite trong 4 giờ',
        status: 'active',
        createdBy: users[1].id,
      },
    }),
    prisma.contract.create({
      data: {
        contractNumber: 'HD-2023-045',
        customerName: 'Tập đoàn FPT',
        customerEmail: 'vendor@fpt.com.vn',
        customerPhone: '024-7300-8866',
        customerAddress: '17 Duy Tân, Cầu Giấy, Hà Nội',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-05-31'),
        termsConditions: 'Bảo hành 18 tháng, đào tạo sử dụng miễn phí',
        status: 'expired',
        createdBy: users[0].id,
      },
    }),
    prisma.contract.create({
      data: {
        contractNumber: 'HD-2024-003',
        customerName: 'Công ty CP Đầu tư Vingroup',
        customerEmail: 'it.procurement@vingroup.net',
        customerPhone: '024-3974-9999',
        customerAddress: '7 Bằng Lăng 1, Vinhomes Riverside, Long Biên, Hà Nội',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-03-31'),
        termsConditions: 'Bảo hành 24 tháng, hỗ trợ kỹ thuật ưu tiên, thay thế nhanh trong 24h',
        status: 'active',
        createdBy: users[1].id,
      },
    }),
  ]);

  console.log(`Created ${contracts.length} contracts`);

  console.log('Creating product serials...');
  const productSerials = await Promise.all([
    prisma.productSerial.create({
      data: {
        serialNumber: 'HP4015N240115001',
        name: 'HP LaserJet Pro 4015n',
        model: 'HP-4015N',
        category: 'Printer',
        description: 'Máy in laser A4 đen trắng, tốc độ 38 trang/phút, kết nối mạng',
        warrantyMonths: 24,
        contractId: contracts[0].id,
        manufactureDate: new Date('2024-01-15'),
        purchaseDate: new Date('2024-02-01'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Triển khai tại tầng 5, phòng IT',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'DL7520240220001',
        name: 'Dell Latitude 7520',
        model: 'DL-7520',
        category: 'Laptop',
        description: 'Laptop doanh nghiệp Intel Core i7-1165G7, 16GB RAM, 512GB SSD',
        warrantyMonths: 12,
        contractId: contracts[1].id,
        manufactureDate: new Date('2024-02-10'),
        purchaseDate: new Date('2024-02-20'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Cấp phát cho nhân viên cấp cao',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'CN2630I240105001',
        name: 'Canon imageRUNNER 2630i',
        model: 'CN-IR2630I',
        category: 'Copier',
        description: 'Máy photocopy đa chức năng A3, in/copy/scan/fax, tốc độ 30 trang/phút',
        warrantyMonths: 18,
        contractId: contracts[0].id,
        manufactureDate: new Date('2023-12-20'),
        purchaseDate: new Date('2024-01-05'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Đặt tại khu vực tiếp tân tầng 1',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'HP800G9230601001',
        name: 'HP EliteDesk 800 G9',
        model: 'HP-800G9',
        category: 'Desktop',
        description: 'Máy tính để bàn Intel Core i5-12500, 8GB RAM, 256GB SSD',
        warrantyMonths: 12,
        contractId: contracts[2].id,
        manufactureDate: new Date('2023-05-15'),
        purchaseDate: new Date('2023-06-01'),
        warrantyStatus: 'expired',
        isActive: true,
        notes: 'Hết bảo hành, đề xuất gia hạn hoặc thay thế',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'LN14G3240125001',
        name: 'Lenovo ThinkPad T14 Gen 3',
        model: 'LN-T14G3',
        category: 'Laptop',
        description: 'Laptop doanh nghiệp AMD Ryzen 7 PRO, 16GB RAM, 1TB SSD',
        warrantyMonths: 24,
        contractId: contracts[0].id,
        manufactureDate: new Date('2024-01-10'),
        purchaseDate: new Date('2024-01-25'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Laptop cao cấp cho ban lãnh đạo',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'SW2960X240401001',
        name: 'Cisco Catalyst 2960-X',
        model: 'WS-C2960X-24TS-L',
        category: 'Network',
        description: 'Switch mạng 24 port Gigabit Ethernet với 4 port SFP+',
        warrantyMonths: 24,
        contractId: contracts[3].id,
        manufactureDate: new Date('2024-03-15'),
        purchaseDate: new Date('2024-04-01'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Triển khai tại data center chính',
      },
    }),
    prisma.productSerial.create({
      data: {
        serialNumber: 'SV2U240301001',
        name: 'Dell PowerEdge R750',
        model: 'DL-R750',
        category: 'Server',
        description: 'Server 2U Intel Xeon Silver 4314, 32GB RAM, 2x 1TB SSD RAID1',
        warrantyMonths: 36,
        contractId: contracts[1].id,
        manufactureDate: new Date('2024-02-28'),
        purchaseDate: new Date('2024-03-15'),
        warrantyStatus: 'valid',
        isActive: true,
        notes: 'Server ảo hóa chính cho hệ thống core banking',
      },
    }),
  ]);

  console.log(`Created ${productSerials.length} product serials`);

  console.log('Creating tickets...');
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-001',
        productSerialId: productSerials[0].id,
        customerName: 'Nguyễn Minh Đức',
        customerEmail: 'duc.nguyen@viettel.com.vn',
        customerPhone: '024-3555-1234',
        issueDescription: 'Máy in HP LaserJet Pro 4015n báo lỗi "Toner Low" và in chất lượng kém, có vệt mờ. Đã thử reset nhưng vẫn không khắc phục được.',
        issueTitle: 'Lỗi toner và chất lượng in kém',
        priority: 'medium',
        status: 'received',
        assignedTo: users[2].id,
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-002',
        productSerialId: productSerials[1].id,
        customerName: 'Phạm Thị Lan Anh',
        customerEmail: 'lananh.pham@techcombank.com.vn',
        customerPhone: '1900-588-999',
        issueDescription: 'Laptop Dell Latitude 7520 không khởi động được sau khi cập nhật Windows. Màn hình hiển thị "Boot Device Not Found". Cần hỗ trợ khẩn cấp.',
        issueTitle: 'Laptop không boot sau update Windows',
        priority: 'high',
        status: 'in_progress',
        assignedTo: users[2].id,
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-003',
        productSerialId: productSerials[2].id,
        customerName: 'Lê Văn Hùng',
        customerEmail: 'hung.le@viettel.com.vn',
        customerPhone: '024-3555-5678',
        issueDescription: 'Máy photocopy Canon imageRUNNER 2630i in và copy bị mờ, có vệt đen dọc theo trang. Đã vệ sinh drum nhưng vẫn không cải thiện.',
        issueTitle: 'Chất lượng in/copy kém - có vệt đen',
        priority: 'low',
        status: 'resolved',
        assignedTo: users[3].id,
        resolvedAt: new Date('2024-12-15T14:30:00Z'),
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-004',
        productSerialId: productSerials[6].id,
        customerName: 'Trần Quốc Việt',
        customerEmail: 'viet.tran@techcombank.com.vn',
        customerPhone: '1900-588-777',
        issueDescription: 'Server Dell PowerEdge R750 báo cảnh báo "Memory Error" và hiệu suất giảm đáng kể. Log system hiển thị lỗi ECC memory. Cần kiểm tra và thay thế RAM.',
        issueTitle: 'Server báo lỗi memory - cần thay RAM',
        priority: 'high',
        status: 'in_progress',
        assignedTo: users[2].id,
      },
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TK-2024-005',
        productSerialId: productSerials[5].id,
        customerName: 'Hoàng Thị Mai',
        customerEmail: 'mai.hoang@vingroup.net',
        customerPhone: '024-3974-8888',
        issueDescription: 'Switch Cisco Catalyst 2960-X mất kết nối ngẫu nhiên ở port 12-16. LED port nhấp nháy bất thường. Ảnh hưởng đến kết nối mạng của 5 máy trạm.',
        issueTitle: 'Switch mất kết nối port 12-16',
        priority: 'medium',
        status: 'received',
        assignedTo: users[3].id,
      },
    }),
  ]);

  console.log(`Created ${tickets.length} tickets`);

  console.log('Creating ticket history...');
  await Promise.all([
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[0].id,
        performedBy: users[2].id,
        actionType: 'updated',
        description: 'Đã kiểm tra máy in HP LaserJet Pro 4015n. Xác nhận toner còn 15%, chất lượng in giảm do drum unit bị mòn.',
        oldValue: null,
        newValue: null,
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[1].id,
        performedBy: users[2].id,
        actionType: 'status_changed',
        description: 'Tiếp nhận ticket khẩn cấp, chuyển sang xử lý ngay lập tức',
        oldValue: 'received',
        newValue: 'in_progress',
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[1].id,
        performedBy: users[2].id,
        actionType: 'updated',
        description: 'Đã kiểm tra laptop Dell Latitude 7520. Phát hiện SSD bị lỗi sau update Windows. Đang backup dữ liệu và chuẩn bị thay thế SSD.',
        oldValue: null,
        newValue: null,
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[2].id,
        performedBy: users[3].id,
        actionType: 'status_changed',
        description: 'Đã thay thế drum unit và cleaning blade cho máy Canon imageRUNNER 2630i. Test in thử nghiệm OK.',
        oldValue: 'in_progress',
        newValue: 'resolved',
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[3].id,
        performedBy: users[2].id,
        actionType: 'updated',
        description: 'Đã chạy memory diagnostic trên server Dell PowerEdge R750. Xác nhận RAM slot 4 bị lỗi ECC. Đặt hàng RAM thay thế.',
        oldValue: null,
        newValue: null,
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: tickets[4].id,
        performedBy: users[3].id,
        actionType: 'updated',
        description: 'Đã kiểm tra switch Cisco Catalyst 2960-X. Phát hiện port 12-16 có dấu hiệu hỏng module. Cần thay thế line card.',
        oldValue: null,
        newValue: null,
      },
    }),
  ]);

  console.log('Created ticket history');

  console.log('Creating warranty history...');
  await Promise.all([
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[0].id,
        actionType: 'created',
        description: 'Yêu cầu bảo hành máy in HP LaserJet Pro 4015n do drum unit bị mòn trước thời hạn. Đã gửi ảnh chụp chất lượng in kém và log lỗi từ máy.',
        performedBy: users[2].id,
        cost: 2500000,
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[1].id,
        actionType: 'updated',
        description: 'Gia hạn bảo hành laptop Dell Latitude 7520 thêm 24 tháng theo gói Dell ProSupport Plus. Bao gồm onsite service và accidental damage protection.',
        performedBy: users[1].id,
        cost: 8500000,
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[2].id,
        actionType: 'updated',
        description: 'Thay thế fuser unit và transfer belt cho máy Canon imageRUNNER 2630i theo warranty. Lỗi E000020-0001 xuất hiện liên tục.',
        performedBy: users[2].id,
        cost: 4200000,
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[3].id,
        actionType: 'created',
        description: 'Yêu cầu bảo hành desktop HP EliteDesk 800 G9 do motherboard bị lỗi. Máy không boot được, đèn LED báo lỗi memory.',
        performedBy: users[3].id,
        cost: 6800000,
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[4].id,
        actionType: 'updated',
        description: 'Thay thế power supply và cooling fan cho switch Cisco Catalyst 2960-X. Nhiệt độ vận hành vượt ngưỡng an toàn.',
        performedBy: users[2].id,
        cost: 3200000,
      },
    }),
    prisma.warrantyHistory.create({
      data: {
        productSerialId: productSerials[5].id,
        actionType: 'updated',
        description: 'Gia hạn bảo hành server Dell PowerEdge R750 theo gói Dell ProSupport Mission Critical. Bao gồm 4-hour onsite response.',
        performedBy: users[1].id,
        cost: 15000000,
      },
    }),
  ]);

  console.log('Created warranty history');

  console.log('Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'warning',
        title: 'Bảo hành sắp hết hạn - HP LaserJet Pro 4015n',
        message: 'Thiết bị HP LaserJet Pro 4015n (S/N: HP4015N240115001) thuộc hợp đồng HD-2024-001 sẽ hết hạn bảo hành vào ngày 15/01/2026. Vui lòng liên hệ khách hàng để gia hạn.',
        userId: users[1].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'info',
        title: 'Ticket khẩn cấp mới - Dell Latitude 7520',
        message: 'Ticket #TK-2024-002 (Độ ưu tiên: Cao) đã được tạo cho laptop Dell Latitude 7520. Khách hàng báo cáo không boot được sau update Windows. Cần xử lý ngay.',
        userId: users[2].id,
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'success',
        title: 'Hoàn thành bảo hành - Canon imageRUNNER 2630i',
        message: 'Ticket #TK-2024-003 đã được giải quyết thành công. Đã thay thế drum unit và cleaning blade cho máy Canon imageRUNNER 2630i. Khách hàng xác nhận máy hoạt động bình thường.',
        userId: users[0].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'error',
        title: 'Lỗi gửi email thông báo',
        message: 'Không thể gửi email thông báo hoàn thành ticket #TK-2024-003 đến khách hàng hung.le@viettel.com.vn. Vui lòng kiểm tra cấu hình SMTP server.',
        userId: users[0].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'warning',
        title: 'Server cần bảo trì khẩn cấp',
        message: 'Server Dell PowerEdge R750 (S/N: SV2U240301001) báo lỗi RAM ECC tại slot 4. Cần thay thế RAM ngay để tránh downtime. Đã đặt hàng linh kiện thay thế.',
        userId: users[2].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'info',
        title: 'Gia hạn hợp đồng thành công',
        message: 'Hợp đồng HD-2024-002 với Ngân hàng TMCP Techcombank đã được gia hạn thêm 12 tháng. Bao gồm các thiết bị với tổng giá trị bảo hành mở rộng.',
        userId: users[1].id,
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