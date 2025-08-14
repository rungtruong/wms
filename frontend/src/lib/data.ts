import { Customer, Product, Contract, WarrantyRequest, Serial, Statistics, Notification, User } from '@/types';

export const mockData = {
  contracts: [
    {
      id: "WC001",
      contractNumber: "HD-BH-2024-001",
      customerId: null,
      customerName: "Nguyễn Văn An",
      customerAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      customerPhone: "0901234567",
      customerEmail: "nguyenvanan@email.com",
      contractProducts: [
        {
          name: "Laptop Dell Inspiron 15",
          model: "Dell-INS-15-3000",
          serial: "DL15-2024-001234"
        }
      ],
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      termsConditions: "Bảo hành 24 tháng, miễn phí sửa chữa lỗi phần cứng",
      warrantyStatus: "valid" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-12-10T15:30:00Z"
    },
    {
      id: "WC002", 
      contractNumber: "HD-BH-2024-002",
      customerId: null,
      customerName: "Trần Thị Bình",
      customerAddress: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
      customerPhone: "0902345678",
      customerEmail: "tranthibinh@email.com",
      contractProducts: [
        {
          name: "iPhone 15 Pro",
          model: "A3108",
          serial: "IP15-2024-005678"
        }
      ],
      startDate: "2024-02-20",
      endDate: "2025-02-20", 
      termsConditions: "Bảo hành 12 tháng, bảo hình màn hình 6 tháng",
      warrantyStatus: "valid" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2024-02-20T14:30:00Z",
      updatedAt: "2024-12-08T11:15:00Z"
    },
    {
      id: "WC003",
      contractNumber: "HD-BH-2024-003",
      customerId: null,
      customerName: "Lê Văn Cường",
      customerAddress: "789 Đường Pasteur, Quận 1, TP.HCM",
      customerPhone: "0903456789",
      customerEmail: "levancuong@email.com",
      contractProducts: [
        {
          name: "Samsung Galaxy S24",
          model: "SM-S921B",
          serial: "SG24-2024-009876"
        }
      ],
      startDate: "2024-03-10",
      endDate: "2025-03-10",
      termsConditions: "Bảo hành 12 tháng toàn bộ máy",
      status: "active" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2024-03-10T10:20:00Z",
      updatedAt: "2024-12-05T09:45:00Z"
    },
    {
      id: "WC004",
      contractNumber: "HD-BH-2023-045",
      customerId: null,
      customerName: "Phạm Thị Dung",
      customerAddress: "321 Đường Võ Văn Tần, Quận 3, TP.HCM",
      customerPhone: "0904567890",
      customerEmail: "phamthidung@email.com",
      contractProducts: [
        {
          name: "MacBook Air M2",
          model: "MBA-M2-13",
          serial: "MBA-2023-112233"
        }
      ],
      startDate: "2023-05-15",
      endDate: "2024-05-15",
      termsConditions: "Bảo hành 12 tháng, hỗ trợ kỹ thuật 24/7",
      warrantyStatus: "expired" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2023-05-15T11:00:00Z",
      updatedAt: "2024-05-15T11:00:00Z"
    },
    {
      id: "WC005",
      contractNumber: "HD-BH-2024-067",
      customerId: null,
      customerName: "Hoàng Minh Tuấn",
      customerAddress: "654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
      customerPhone: "0905678901",
      customerEmail: "hoangminhtuan@email.com",
      contractProducts: [
        {
          name: "HP Pavilion Gaming",
          model: "HP-PG-15-dk2",
          serial: "HP-2024-445566"
        }
      ],
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      termsConditions: "Bảo hành 12 tháng, thay thế linh kiện miễn phí",
      warrantyStatus: "voided" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2024-06-01T14:15:00Z",
      updatedAt: "2024-11-20T13:30:00Z"
    },
    {
      id: "WC006",
      contractNumber: "HD-BH-2023-089",
      customerId: null,
      customerName: "Ngô Thị Lan",
      customerAddress: "987 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
      customerPhone: "0906789012",
      customerEmail: "ngothilan@email.com",
      contractProducts: [
        {
          name: "Asus ROG Strix",
          model: "ROG-G15-G513",
          serial: "ASUS-2023-778899"
        }
      ],
      startDate: "2023-08-20",
      endDate: "2024-08-20",
      termsConditions: "Bảo hành 12 tháng gaming laptop",
      warrantyStatus: "expired" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2023-08-20T16:45:00Z",
      updatedAt: "2024-08-20T16:45:00Z"
    },
    {
      id: "WC007",
      contractNumber: "HD-BH-2024-123",
      customerId: null,
      customerName: "Đỗ Văn Hùng",
      customerAddress: "147 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
      customerPhone: "0907890123",
      customerEmail: "dovanhung@email.com",
      contractProducts: [
        {
          name: "Surface Pro 9",
          model: "SP9-128GB",
          serial: "SP9-2024-334455"
        }
      ],
      startDate: "2024-07-10",
      endDate: "2025-07-10",
      termsConditions: "Bảo hành 12 tháng, bao gồm bút Surface Pen",
      warrantyStatus: "voided" as const,
      createdBy: "98e32aa6-fd7a-4e46-939e-522fb1226d8c",
      createdAt: "2024-07-10T09:30:00Z",
      updatedAt: "2024-11-15T14:20:00Z"
    }
  ] as Contract[],

  serials: [
    {
      id: "S001",
      serialNumber: "DL15-2024-001234",
      productName: "Laptop Dell Inspiron 15",
      model: "Dell-INS-15-3000",
      manufactureDate: "2024-01-10",
      contractId: "WC001",
      warrantyRemaining: "18 tháng",
      warrantyStatus: "valid" as const,
      repairHistory: [
        {
          date: "2024-06-15",
          issue: "Thay pin laptop",
          solution: "Thay pin mới, test OK",
          technician: "Nguyễn Văn Tâm"
        }
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-12-10T16:30:00Z"
    },
    {
      id: "S002", 
      serialNumber: "IP15-2024-005678",
      productName: "iPhone 15 Pro",
      model: "A3108",
      manufactureDate: "2024-02-15",
      contractId: "WC002", 
      warrantyRemaining: "6 tháng",
      warrantyStatus: "valid" as const,
      repairHistory: [],
      createdAt: "2024-02-20T11:15:00Z",
      updatedAt: "2024-12-08T14:45:00Z"
    },
    {
      id: "S003",
      serialNumber: "SG24-2024-009876",
      productName: "Samsung Galaxy S24",
      model: "SM-S921B",
      manufactureDate: "2024-03-05",
      contractId: "WC003",
      warrantyRemaining: "8 tháng",
      status: "active" as const,
      repairHistory: [],
      createdAt: "2024-03-10T12:30:00Z",
      updatedAt: "2024-12-05T10:20:00Z"
    },
    {
      id: "S004",
      serialNumber: "MBA-2023-112233",
      productName: "MacBook Air M2",
      model: "MBA-M2-13",
      manufactureDate: "2023-05-10",
      contractId: "WC004",
      warrantyRemaining: "Hết hạn",
      warrantyStatus: "expired" as const,
      repairHistory: [
        {
          date: "2024-02-10",
          issue: "Thay pin MacBook",
          solution: "Thay pin chính hãng Apple",
          technician: "Lê Văn Minh"
        }
      ],
      createdAt: "2023-05-15T13:00:00Z",
      updatedAt: "2024-05-15T13:00:00Z"
    },
    {
      id: "S005",
      serialNumber: "HP-2024-445566",
      productName: "HP Pavilion Gaming",
      model: "HP-PG-15-dk2",
      manufactureDate: "2024-05-25",
      contractId: "WC005",
      warrantyRemaining: "9 tháng",
      warrantyStatus: "voided" as const,
      repairHistory: [
        {
          date: "2024-07-15",
          issue: "Lỗi card đồ họa",
          solution: "Đang chờ linh kiện thay thế",
          technician: "Phạm Văn Đức"
        }
      ],
      createdAt: "2024-06-01T15:45:00Z",
      updatedAt: "2024-11-20T14:30:00Z"
    },
    {
      id: "S006",
      serialNumber: "ASUS-2023-778899",
      productName: "Asus ROG Strix",
      model: "ROG-G15-G513",
      manufactureDate: "2023-08-15",
      contractId: "WC006",
      warrantyRemaining: "Hết hạn",
      warrantyStatus: "expired" as const,
      repairHistory: [
        {
          date: "2024-01-20",
          issue: "Quạt tản nhiệt kêu to",
          solution: "Thay quạt tản nhiệt mới",
          technician: "Nguyễn Thành Long"
        },
        {
          date: "2024-06-10",
          issue: "Màn hình bị sọc",
          solution: "Thay màn hình LCD",
          technician: "Trần Văn Hải"
        }
      ],
      createdAt: "2023-08-20T17:00:00Z",
      updatedAt: "2024-08-20T17:00:00Z"
    },
    {
      id: "S007",
      serialNumber: "SP9-2024-334455",
      productName: "Surface Pro 9",
      model: "SP9-128GB",
      manufactureDate: "2024-07-05",
      contractId: "WC007",
      warrantyRemaining: "10 tháng",
      warrantyStatus: "voided" as const,
      repairHistory: [],
      createdAt: "2024-07-10T10:30:00Z",
      updatedAt: "2024-11-15T15:20:00Z"
    },
    {
      id: "S008",
      serialNumber: "LG-2024-556677",
      productName: "LG Gram 17",
      model: "LG-17Z90P",
      manufactureDate: "2024-04-12",
      contractId: null,
      warrantyRemaining: "11 tháng",
      warrantyStatus: "valid" as const,
      repairHistory: [],
      createdAt: "2024-04-12T14:00:00Z",
      updatedAt: "2024-12-01T11:30:00Z"
    },
    {
      id: "S009",
      serialNumber: "SONY-2023-667788",
      productName: "Sony VAIO FE",
      model: "VAIO-FE14",
      manufactureDate: "2023-09-08",
      contractId: null,
      warrantyRemaining: "Hết hạn",
      status: "expired" as const,
      repairHistory: [
        {
          date: "2024-03-15",
          issue: "Bàn phím không hoạt động",
          solution: "Thay bàn phím mới",
          technician: "Võ Thị Mai"
        }
      ],
      createdAt: "2023-09-08T16:30:00Z",
      updatedAt: "2024-09-08T16:30:00Z"
    },
    {
      id: "S010",
      serialNumber: "ACER-2024-889900",
      productName: "Acer Aspire 5",
      model: "A515-57",
      manufactureDate: "2024-08-01",
      contractId: null,
      warrantyRemaining: "2 tháng",
      warrantyStatus: "valid" as const,
      repairHistory: [],
      createdAt: "2024-08-01T12:00:00Z",
      updatedAt: "2024-12-12T09:15:00Z"
    }
  ] as Serial[],

  warrantyRequests: [
    {
      id: "WR001",
      ticketNumber: "YC-BH-2024-001",
      productSerialId: "S001",
      customerName: "Nguyễn Văn An",
      issueTitle: "Laptop không khởi động được",
      issueDescription: "Laptop bị đen màn hình khi bật nguồn, đã thử reset BIOS nhưng không được",
      status: "in_progress" as const, 
      priority: "high" as const,
      assignedTo: "Nguyễn Văn Tâm",
      createdAt: "2024-12-01T10:15:00Z",
      updatedAt: "2024-12-02T09:30:00Z",
      productSerial: {
        id: "S001",
        serialNumber: "DL15-2024-001234",
        name: "Dell Inspiron 15",
        model: "3520",
        warrantyMonths: 24,
        warrantyStatus: "valid" as const
      },
      history: [
        {
          id: "H001",
          actionType: "created",
          description: "Tiếp nhận yêu cầu bảo hành",
          oldValue: undefined,
          newValue: "received",
          performedBy: { id: "U001", fullName: "Hệ thống" },
          createdAt: "2024-12-01T10:15:00Z"
        },
        {
          id: "H002",
          actionType: "status_update",
          description: "Đang chẩn đoán lỗi phần cứng",
          oldValue: "received",
          newValue: "in_progress",
          performedBy: { id: "U002", fullName: "Nguyễn Văn Tâm" },
          createdAt: "2024-12-02T09:30:00Z"
        }
      ]
    },
    {
      id: "WR002",
      ticketNumber: "YC-BH-2024-002", 
      productSerialId: "S002",
      customerName: "Trần Thị Bình",
      issueTitle: "Màn hình bị vỡ góc",
      issueDescription: "Màn hình iPhone bị nứt ở góc trên bên phải, cảm ứng vẫn hoạt động bình thường",
      status: "resolved" as const,
      priority: "medium" as const, 
      assignedTo: "Lê Văn Đức",
      createdAt: "2024-11-20T16:45:00Z",
      updatedAt: "2024-11-25T11:00:00Z",
      productSerial: {
        id: "S002",
        serialNumber: "IP15-2024-005678",
        name: "iPhone 15",
        model: "A2846",
        warrantyMonths: 12,
        warrantyStatus: "valid" as const
      },
      history: [
        {
          id: "H003",
          actionType: "created",
          description: "Tiếp nhận yêu cầu bảo hành",
          oldValue: undefined,
          newValue: "received",
          performedBy: { id: "U001", fullName: "Hệ thống" },
          createdAt: "2024-11-20T16:45:00Z"
        },
        {
          id: "H004",
          actionType: "status_update",
          description: "Đặt hàng màn hình thay thế",
          oldValue: "received",
          newValue: "in_progress",
          performedBy: { id: "U003", fullName: "Lê Văn Đức" },
          createdAt: "2024-11-22T10:00:00Z"
        },
        {
          id: "H005",
          actionType: "status_update",
          description: "Thay màn hình mới hoàn tất, test OK",
          oldValue: "in_progress",
          newValue: "resolved",
          performedBy: { id: "U003", fullName: "Lê Văn Đức" },
          createdAt: "2024-11-25T11:00:00Z"
        }
      ]
    },
    {
      id: "WR003",
      ticketNumber: "YC-BH-2024-003",
      productSerialId: "S003",
      customerName: "Lê Văn Cường",
      issueTitle: "Pin chai nhanh",
      issueDescription: "Điện thoại chỉ dùng được 4-5 tiếng là hết pin, trước đây dùng cả ngày",
      status: "received" as const,
      priority: "urgent" as const,
      assignedTo: "Trần Văn Minh",
      createdAt: "2024-12-05T14:20:00Z",
      updatedAt: "2024-12-05T14:20:00Z",
      productSerial: {
        id: "S003",
        serialNumber: "SG24-2024-009876",
        name: "Samsung Galaxy S24",
        model: "SM-S921B",
        warrantyMonths: 24,
        warrantyStatus: "valid" as const
      },
      history: [
        {
          id: "H006",
          actionType: "created",
          description: "Tiếp nhận yêu cầu bảo hành",
          oldValue: undefined,
          newValue: "received",
          performer: { id: "U001", fullName: "Hệ thống" },
          createdAt: "2024-12-05T14:20:00Z"
        }
      ]
    }
  ] as WarrantyRequest[],

  statistics: {
    totalContracts: 156,
    activeContracts: 142,
    expiredContracts: 14, 
    expiringThisMonth: 8,
    totalSerials: 289,
    pendingRequests: 12,
    processingRequests: 5,
    completedRequests: 127,
    monthlyRevenue: 45600000,
    topFailingProducts: [
      {"name": "Laptop Dell Inspiron", "failures": 23},
      {"name": "iPhone 15 Series", "failures": 18},
      {"name": "Samsung Galaxy S24", "failures": 15}
    ]
  } as Statistics,

  notifications: [
    {
      id: "N001",
      type: "warning" as const,
      title: "Hợp đồng sắp hết hạn",
      message: "8 hợp đồng bảo hành sẽ hết hạn trong tháng này",
      date: "2024-12-12T08:00:00Z",
      read: false
    },
    {
      id: "N002", 
      type: "info" as const,
      title: "Yêu cầu bảo hành mới",
      message: "Có 3 yêu cầu bảo hành mới cần xử lý",
      date: "2024-12-12T09:15:00Z",
      read: false
    }
  ] as Notification[],

  users: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@company.com",
      passwordHash: "$2b$10$...",
      fullName: "Nguyễn Văn Admin",
      role: "admin" as const,
      isActive: true,
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-12-10T10:30:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002", 
      email: "manager@company.com",
      passwordHash: "$2b$10$...",
      fullName: "Trần Thị Manager",
      role: "manager" as const,
      isActive: true,
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-12-08T14:20:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      email: "tech1@company.com", 
      passwordHash: "$2b$10$...",
      fullName: "Lê Văn Tâm",
      role: "technician" as const,
      isActive: true,
      createdAt: "2024-03-10T10:00:00Z",
      updatedAt: "2024-12-05T16:45:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      email: "tech2@company.com",
      passwordHash: "$2b$10$...", 
      fullName: "Phạm Thị Hoa",
      role: "technician" as const,
      isActive: true,
      createdAt: "2024-04-05T11:30:00Z",
      updatedAt: "2024-12-01T09:10:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      email: "tech3@company.com",
      passwordHash: "$2b$10$...",
      fullName: "Hoàng Minh Đức", 
      role: "technician" as const,
      isActive: false,
      createdAt: "2024-05-12T13:45:00Z",
      updatedAt: "2024-11-15T08:30:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440006",
      email: "manager2@company.com",
      passwordHash: "$2b$10$...",
      fullName: "Vũ Thị Lan",
      role: "manager" as const,
      isActive: true,
      createdAt: "2024-06-18T15:20:00Z", 
      updatedAt: "2024-12-12T11:00:00Z"
    }
  ] as User[]
};
