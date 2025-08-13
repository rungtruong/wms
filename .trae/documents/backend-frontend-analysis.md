# Phân Tích Backend-Frontend và Đề Xuất Cập Nhật

## 1. Tổng Quan Phân Tích

Sau khi phân tích code frontend và backend hiện tại, tôi đã xác định được những gap chính cần được giải quyết để backend có thể hỗ trợ đầy đủ các chức năng mà frontend đang sử dụng.

## 2. Frontend Requirements Analysis

### 2.1 Data Models Frontend Đang Sử dụng

**Customer Interface:**
```typescript
interface Customer {
  name: string;
  address: string;
  phone: string;
  email: string;
}
```

**Contract Interface:**
```typescript
interface Contract {
  id: string;
  contractNumber: string;
  customer: Customer;
  products: Product[];
  startDate: string;
  endDate: string;
  terms: string;
  status: 'active' | 'expired' | 'suspended';
  createdAt: string;
}
```

**WarrantyRequest Interface:**
```typescript
interface WarrantyRequest {
  id: string;
  ticketNumber: string;
  serialNumber: string;
  customerName: string;
  issue: string;
  description: string;
  status: 'received' | 'validated' | 'processing' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}
```

**Statistics Interface:**
```typescript
interface Statistics {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  expiringThisMonth: number;
  totalSerials: number;
  pendingRequests: number;
  processingRequests: number;
  completedRequests: number;
  monthlyRevenue: number;
  topFailingProducts: { name: string; failures: number }[];
}
```

**Notification Interface:**
```typescript
interface Notification {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
}
```

### 2.2 Frontend Pages và Chức Năng

1. **Dashboard (/)**: Hiển thị statistics, charts, recent warranty requests
2. **Contracts (/contracts)**: CRUD operations cho contracts
3. **Serials (/serials)**: Quản lý serial numbers
4. **Requests (/requests)**: Quản lý warranty requests
5. **Customer Portal (/customer-portal)**: Tra cứu bảo hành bằng serial number
6. **Notifications (/notifications)**: Quản lý thông báo

## 3. Backend Current State Analysis

### 3.1 Existing API Endpoints

**Contracts:**
- `GET /contracts` - Lấy danh sách contracts
- `POST /contracts` - Tạo contract mới
- `GET /contracts/:id` - Lấy contract theo ID
- `GET /contracts/number/:contractNumber` - Lấy contract theo số
- `PATCH /contracts/:id` - Cập nhật contract
- `DELETE /contracts/:id` - Xóa contract

**Tickets:**
- `GET /tickets` - Lấy danh sách tickets
- `POST /tickets` - Tạo ticket mới
- `GET /tickets/:id` - Lấy ticket theo ID
- `PATCH /tickets/:id` - Cập nhật ticket
- `POST /tickets/:id/comments` - Thêm comment
- `GET /tickets/:id/comments` - Lấy comments
- `DELETE /tickets/:id` - Xóa ticket

**Serials:**
- `GET /serials` - Lấy danh sách serials
- `POST /serials` - Tạo serial mới
- `GET /serials/warranty/:serialNumber` - Kiểm tra bảo hành (không cần auth)
- `GET /serials/:id` - Lấy serial theo ID
- `GET /serials/number/:serialNumber` - Lấy serial theo số
- `PATCH /serials/:id` - Cập nhật serial
- `PATCH /serials/:id/warranty-status` - Cập nhật trạng thái bảo hành
- `DELETE /serials/:id` - Xóa serial

**Products:**
- `GET /products` - Lấy danh sách products
- `POST /products` - Tạo product mới
- `GET /products/:id` - Lấy product theo ID
- `PATCH /products/:id` - Cập nhật product
- `DELETE /products/:id` - Xóa product

**Users:**
- `GET /users` - Lấy danh sách users
- `POST /users` - Tạo user mới
- `GET /users/:id` - Lấy user theo ID
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

**Auth:**
- `POST /auth/login` - Đăng nhập

**Warranty History:**
- `GET /warranty-history` - Lấy lịch sử bảo hành
- `POST /warranty-history` - Tạo record mới
- `GET /warranty-history/:id` - Lấy record theo ID
- `PATCH /warranty-history/:id` - Cập nhật record
- `DELETE /warranty-history/:id` - Xóa record

### 3.2 Database Schema Issues

**Mapping Issues giữa Frontend và Backend:**

1. **Contract Status Mismatch:**
   - Frontend: `'active' | 'expired' | 'suspended'`
   - Backend: `'active' | 'expired' | 'suspended' | 'cancelled'`

2. **Ticket Status Mismatch:**
   - Frontend: `'received' | 'validated' | 'processing' | 'completed'`
   - Backend: `'new' | 'in_progress' | 'pending' | 'resolved' | 'closed'`

3. **Ticket Priority Mismatch:**
   - Frontend: `'low' | 'medium' | 'high'`
   - Backend: `'low' | 'medium' | 'high' | 'urgent'`

## 4. Missing API Endpoints

### 4.1 Statistics/Dashboard APIs

**THIẾU HOÀN TOÀN** - Cần tạo mới:

```typescript
// GET /api/dashboard/statistics
interface DashboardStatistics {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  expiringThisMonth: number;
  totalSerials: number;
  pendingRequests: number;
  processingRequests: number;
  completedRequests: number;
  monthlyRevenue: number;
  topFailingProducts: { name: string; failures: number }[];
}

// GET /api/dashboard/charts/warranty-requests
interface WarrantyRequestsChart {
  labels: string[];
  data: number[];
}

// GET /api/dashboard/charts/product-failures
interface ProductFailuresChart {
  labels: string[];
  data: number[];
}
```

### 4.2 Notifications APIs

**THIẾU HOÀN TOÀN** - Cần tạo mới:

```typescript
// GET /api/notifications
// POST /api/notifications
// PATCH /api/notifications/:id/read
// PATCH /api/notifications/mark-all-read
// DELETE /api/notifications/:id
```

### 4.3 Customer Portal APIs

**CẦN CẢI THIỆN** - Endpoint hiện tại `/serials/warranty/:serialNumber` cần trả về đầy đủ thông tin:

```typescript
// GET /api/customer-portal/warranty/:serialNumber
interface CustomerPortalResponse {
  serial: {
    serialNumber: string;
    productName: string;
    model: string;
    manufactureDate: string;
    warrantyRemaining: string;
    status: string;
    repairHistory: RepairHistory[];
  };
  contract: {
    contractNumber: string;
    customer: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    startDate: string;
    endDate: string;
    terms: string;
    status: string;
  };
}
```

## 5. Đề Xuất Cập Nhật Backend

### 5.1 Tạo Dashboard Module

**File cần tạo:**
- `src/dashboard/dashboard.module.ts`
- `src/dashboard/dashboard.controller.ts`
- `src/dashboard/dashboard.service.ts`
- `src/dashboard/dto/dashboard-statistics.dto.ts`

**Endpoints cần implement:**
```typescript
@Controller('dashboard')
export class DashboardController {
  @Get('statistics')
  async getStatistics(): Promise<DashboardStatistics>
  
  @Get('charts/warranty-requests')
  async getWarrantyRequestsChart(): Promise<WarrantyRequestsChart>
  
  @Get('charts/product-failures')
  async getProductFailuresChart(): Promise<ProductFailuresChart>
}
```

### 5.2 Tạo Notifications Module

**File cần tạo:**
- `src/notifications/notifications.module.ts`
- `src/notifications/notifications.controller.ts`
- `src/notifications/notifications.service.ts`
- `src/notifications/dto/create-notification.dto.ts`
- `src/notifications/dto/update-notification.dto.ts`

**Database Schema cần thêm:**
```prisma
model Notification {
  id        String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  type      NotificationType
  title     String            @db.VarChar(200)
  message   String
  userId    String?           @map("user_id") @db.Uuid
  read      Boolean           @default(false)
  createdAt DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
  
  user User? @relation(fields: [userId], references: [id])
  
  @@map("notifications")
}

enum NotificationType {
  warning
  info
  error
  success
}
```

### 5.3 Cập Nhật Customer Portal

**Cập nhật SerialsController:**
```typescript
@Get('warranty/:serialNumber')
async checkWarrantyDetailed(@Param('serialNumber') serialNumber: string) {
  return this.serialsService.getWarrantyDetails(serialNumber);
}
```

**Cập nhật SerialsService:**
```typescript
async getWarrantyDetails(serialNumber: string) {
  const serial = await this.prisma.serial.findUnique({
    where: { serialNumber },
    include: {
      product: true,
      contract: {
        include: {
          creator: true
        }
      },
      warrantyHistory: {
        include: {
          performer: true
        },
        orderBy: {
          performedAt: 'desc'
        }
      }
    }
  });
  
  // Transform data to match frontend interface
  return this.transformToCustomerPortalResponse(serial);
}
```

### 5.4 Cập Nhật Enum Values

**Cập nhật Prisma Schema:**
```prisma
enum TicketStatus {
  received    // map to 'new'
  validated   // new status
  processing  // map to 'in_progress'
  completed   // map to 'resolved'
}
```

### 5.5 Cập Nhật App Module

**Thêm vào app.module.ts:**
```typescript
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ... existing modules
    DashboardModule,
    NotificationsModule,
  ],
})
export class AppModule {}
```

## 6. Migration Plan

### Phase 1: Database Schema Updates
1. Tạo migration cho Notification model
2. Cập nhật TicketStatus enum
3. Chạy migration

### Phase 2: Core Modules
1. Tạo Dashboard module với statistics APIs
2. Tạo Notifications module
3. Cập nhật Customer Portal endpoints

### Phase 3: Data Transformation
1. Tạo DTOs cho response mapping
2. Implement data transformation services
3. Update existing endpoints để match frontend interfaces

### Phase 4: Testing & Integration
1. Test tất cả endpoints mới
2. Verify data mapping
3. Integration testing với frontend

## 7. Ưu Tiên Thực Hiện

**Cao (Critical):**
1. Dashboard Statistics API - Frontend dashboard không hoạt động
2. Customer Portal API improvements - Chức năng tra cứu bảo hành
3. Enum mapping fixes - Data inconsistency

**Trung Bình (Important):**
1. Notifications API - UX enhancement
2. Charts APIs - Dashboard visualization

**Thấp (Nice to have):**
1. Additional filtering endpoints
2. Performance optimizations
3. Advanced search features

## 8. Kết Luận

Backend hiện tại đã có cấu trúc cơ bản tốt với Prisma, NestJS và authentication. Tuy nhiên, cần bổ sung các module quan trọng (Dashboard, Notifications) và cải thiện data mapping để frontend có thể hoạt động đầy đủ. Ưu tiên cao nhất là Dashboard Statistics API vì đây là trang chính của ứng dụng.