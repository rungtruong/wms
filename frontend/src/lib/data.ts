import { Contract, Serial, WarrantyRequest, Statistics, Notification } from '@/types';

export const mockData = {
  contracts: [
    {
      id: "WC001",
      contractNumber: "HD-BH-2024-001",
      customer: {
        name: "Nguyễn Văn An",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        phone: "0901234567",
        email: "nguyenvanan@email.com"
      },
      products: [
        {
          name: "Laptop Dell Inspiron 15",
          model: "Dell-INS-15-3000",
          serial: "DL15-2024-001234"
        }
      ],
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      terms: "Bảo hành 24 tháng, miễn phí sửa chữa lỗi phần cứng",
      status: "active" as const,
      createdAt: "2024-01-15T09:00:00Z"
    },
    {
      id: "WC002", 
      contractNumber: "HD-BH-2024-002",
      customer: {
        name: "Trần Thị Bình",
        address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM", 
        phone: "0902345678",
        email: "tranthibinh@email.com"
      },
      products: [
        {
          name: "iPhone 15 Pro",
          model: "A3108",
          serial: "IP15-2024-005678"
        }
      ],
      startDate: "2024-02-20",
      endDate: "2025-02-20", 
      terms: "Bảo hành 12 tháng, bảo hành màn hình 6 tháng",
      status: "active" as const,
      createdAt: "2024-02-20T14:30:00Z"
    },
    {
      id: "WC003",
      contractNumber: "HD-BH-2024-003",
      customer: {
        name: "Lê Văn Cường",
        address: "789 Đường Pasteur, Quận 1, TP.HCM",
        phone: "0903456789",
        email: "levancuong@email.com"
      },
      products: [
        {
          name: "Samsung Galaxy S24",
          model: "SM-S921B",
          serial: "SG24-2024-009876"
        }
      ],
      startDate: "2024-03-10",
      endDate: "2025-03-10",
      terms: "Bảo hành 12 tháng toàn bộ máy",
      status: "active" as const,
      createdAt: "2024-03-10T10:20:00Z"
    },
    {
      id: "WC004",
      contractNumber: "HD-BH-2023-045",
      customer: {
        name: "Phạm Thị Dung",
        address: "321 Đường Võ Văn Tần, Quận 3, TP.HCM",
        phone: "0904567890",
        email: "phamthidung@email.com"
      },
      products: [
        {
          name: "MacBook Air M2",
          model: "MBA-M2-13",
          serial: "MBA-2023-112233"
        }
      ],
      startDate: "2023-05-15",
      endDate: "2024-05-15",
      terms: "Bảo hành 12 tháng, hỗ trợ kỹ thuật 24/7",
      status: "expired" as const,
      createdAt: "2023-05-15T11:00:00Z"
    },
    {
      id: "WC005",
      contractNumber: "HD-BH-2024-067",
      customer: {
        name: "Hoàng Minh Tuấn",
        address: "654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
        phone: "0905678901",
        email: "hoangminhtuan@email.com"
      },
      products: [
        {
          name: "HP Pavilion Gaming",
          model: "HP-PG-15-dk2",
          serial: "HP-2024-445566"
        }
      ],
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      terms: "Bảo hành 12 tháng, thay thế linh kiện miễn phí",
      status: "suspended" as const,
      createdAt: "2024-06-01T14:15:00Z"
    },
    {
      id: "WC006",
      contractNumber: "HD-BH-2023-089",
      customer: {
        name: "Ngô Thị Lan",
        address: "987 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
        phone: "0906789012",
        email: "ngothilan@email.com"
      },
      products: [
        {
          name: "Asus ROG Strix",
          model: "ROG-G15-G513",
          serial: "ASUS-2023-778899"
        }
      ],
      startDate: "2023-08-20",
      endDate: "2024-08-20",
      terms: "Bảo hành 12 tháng gaming laptop",
      status: "expired" as const,
      createdAt: "2023-08-20T16:45:00Z"
    },
    {
      id: "WC007",
      contractNumber: "HD-BH-2024-123",
      customer: {
        name: "Đỗ Văn Hùng",
        address: "147 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
        phone: "0907890123",
        email: "dovanhung@email.com"
      },
      products: [
        {
          name: "Surface Pro 9",
          model: "SP9-128GB",
          serial: "SP9-2024-334455"
        }
      ],
      startDate: "2024-07-10",
      endDate: "2025-07-10",
      terms: "Bảo hành 12 tháng, bao gồm bút Surface Pen",
      status: "suspended" as const,
      createdAt: "2024-07-10T09:30:00Z"
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
      status: "active" as const,
      repairHistory: [
        {
          date: "2024-06-15",
          issue: "Thay pin laptop",
          solution: "Thay pin mới, test OK",
          technician: "Nguyễn Văn Tâm"
        }
      ]
    },
    {
      id: "S002", 
      serialNumber: "IP15-2024-005678",
      productName: "iPhone 15 Pro",
      model: "A3108",
      manufactureDate: "2024-02-15",
      contractId: "WC002", 
      warrantyRemaining: "6 tháng",
      status: "active" as const,
      repairHistory: []
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
      repairHistory: []
    },
    {
      id: "S004",
      serialNumber: "MBA-2023-112233",
      productName: "MacBook Air M2",
      model: "MBA-M2-13",
      manufactureDate: "2023-05-10",
      contractId: "WC004",
      warrantyRemaining: "Hết hạn",
      status: "expired" as const,
      repairHistory: [
        {
          date: "2024-02-10",
          issue: "Thay pin MacBook",
          solution: "Thay pin chính hãng Apple",
          technician: "Lê Văn Minh"
        }
      ]
    },
    {
      id: "S005",
      serialNumber: "HP-2024-445566",
      productName: "HP Pavilion Gaming",
      model: "HP-PG-15-dk2",
      manufactureDate: "2024-05-25",
      contractId: "WC005",
      warrantyRemaining: "9 tháng",
      status: "suspended" as const,
      repairHistory: [
        {
          date: "2024-07-15",
          issue: "Lỗi card đồ họa",
          solution: "Đang chờ linh kiện thay thế",
          technician: "Phạm Văn Đức"
        }
      ]
    },
    {
      id: "S006",
      serialNumber: "ASUS-2023-778899",
      productName: "Asus ROG Strix",
      model: "ROG-G15-G513",
      manufactureDate: "2023-08-15",
      contractId: "WC006",
      warrantyRemaining: "Hết hạn",
      status: "expired" as const,
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
      ]
    },
    {
      id: "S007",
      serialNumber: "SP9-2024-334455",
      productName: "Surface Pro 9",
      model: "SP9-128GB",
      manufactureDate: "2024-07-05",
      contractId: "WC007",
      warrantyRemaining: "10 tháng",
      status: "suspended" as const,
      repairHistory: []
    },
    {
      id: "S008",
      serialNumber: "LG-2024-556677",
      productName: "LG Gram 17",
      model: "LG-17Z90P",
      manufactureDate: "2024-04-12",
      contractId: null,
      warrantyRemaining: "14 tháng",
      status: "active" as const,
      repairHistory: []
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
      ]
    },
    {
      id: "S010",
      serialNumber: "ACER-2024-889900",
      productName: "Acer Aspire 5",
      model: "A515-57",
      manufactureDate: "2024-08-01",
      contractId: null,
      warrantyRemaining: "23 tháng",
      status: "active" as const,
      repairHistory: []
    }
  ] as Serial[],

  warrantyRequests: [
    {
      id: "WR001",
      ticketNumber: "YC-BH-2024-001",
      serialNumber: "DL15-2024-001234",
      customerName: "Nguyễn Văn An",
      issue: "Laptop không khởi động được",
      description: "Laptop bị đen màn hình khi bật nguồn, đã thử reset BIOS nhưng không được",
      status: "processing" as const, 
      priority: "high" as const,
      assignedTo: "Nguyễn Văn Tâm",
      createdAt: "2024-12-01T10:15:00Z",
      updatedAt: "2024-12-02T09:30:00Z",
      timeline: [
        {
          date: "2024-12-01T10:15:00Z",
          status: "received",
          note: "Tiếp nhận yêu cầu bảo hành"
        },
        {
          date: "2024-12-01T14:00:00Z", 
          status: "validated",
          note: "Kiểm tra bảo hành hợp lệ"
        },
        {
          date: "2024-12-02T09:30:00Z",
          status: "processing", 
          note: "Đang chẩn đoán lỗi phần cứng"
        }
      ]
    },
    {
      id: "WR002",
      ticketNumber: "YC-BH-2024-002", 
      serialNumber: "IP15-2024-005678",
      customerName: "Trần Thị Bình",
      issue: "Màn hình bị vỡ góc",
      description: "Màn hình iPhone bị nứt ở góc trên bên phải, cảm ứng vẫn hoạt động bình thường",
      status: "completed" as const,
      priority: "medium" as const, 
      assignedTo: "Lê Văn Đức",
      createdAt: "2024-11-20T16:45:00Z",
      updatedAt: "2024-11-25T11:00:00Z",
      timeline: [
        {
          date: "2024-11-20T16:45:00Z",
          status: "received", 
          note: "Tiếp nhận yêu cầu bảo hành"
        },
        {
          date: "2024-11-21T08:00:00Z",
          status: "validated",
          note: "Kiểm tra bảo hành hợp lệ"
        },
        {
          date: "2024-11-22T10:00:00Z",
          status: "processing",
          note: "Đặt hàng màn hình thay thế"
        },
        {
          date: "2024-11-25T11:00:00Z",
          status: "completed",
          note: "Thay màn hình mới hoàn tất, test OK"
        }
      ]
    },
    {
      id: "WR003",
      ticketNumber: "YC-BH-2024-003",
      serialNumber: "SG24-2024-009876",
      customerName: "Lê Văn Cường",
      issue: "Pin chai nhanh",
      description: "Điện thoại chỉ dùng được 4-5 tiếng là hết pin, trước đây dùng cả ngày",
      status: "received" as const,
      priority: "low" as const,
      assignedTo: "Trần Văn Minh",
      createdAt: "2024-12-05T14:20:00Z",
      updatedAt: "2024-12-05T14:20:00Z",
      timeline: [
        {
          date: "2024-12-05T14:20:00Z",
          status: "received",
          note: "Tiếp nhận yêu cầu bảo hành"
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
  ] as Notification[]
};
