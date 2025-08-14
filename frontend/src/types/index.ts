export interface Customer {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Product {
  name: string;
  model: string;
  serial: string;
}

export interface ContractProduct {
  id: string;
  contractId: string;
  productSerialId: string;
  quantity: number;
  unitPrice: number;
  productSerial: {
    id: string;
    serialNumber: string;
    name: string;
    model: string;
    category?: string;
    description?: string;
    warrantyMonths: number;
    contractId?: string;
    manufactureDate?: string;
    purchaseDate?: string;
    warrantyStatus: "valid" | "expired" | "voided";
    isActive: boolean;
    notes?: string;
  };
}

export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  contractProducts: ContractProduct[];
  startDate: string;
  endDate: string;
  termsConditions: string;
  status: "active" | "expired" | "suspended";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairHistory {
  date: string;
  issue: string;
  solution: string;
  technician: string;
}

export interface Serial {
  id: string;
  serialNumber: string;
  productName: string;
  model: string;
  manufactureDate: string;
  contractId: string;
  warrantyRemaining: string;
  warrantyStatus: "valid" | "expired" | "voided";
  repairHistory: RepairHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  date: string;
  status: string;
  note: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: "admin" | "manager" | "technician";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyRequest {
  id: string;
  ticketNumber: string;
  productSerialId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  issueTitle: string;
  issueDescription: string;
  status: "new" | "received" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  productSerial: {
    id: string;
    serialNumber: string;
    name: string;
    model: string;
    category?: string;
    description?: string;
    warrantyMonths: number;
    contractId?: string;
    manufactureDate?: string;
    purchaseDate?: string;
    warrantyStatus: "valid" | "expired" | "voided";
    isActive: boolean;
    notes?: string;
    contract?: {
      id: string;
      contractNumber: string;
      customerName: string;
      customerEmail?: string;
      customerPhone?: string;
      customerAddress?: string;
      startDate: string;
      endDate: string;
      termsConditions?: string;
      status: "active" | "expired" | "suspended";
    };
  };
  assignee?: {
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "manager" | "technician";
  };
  history: {
    id: string;
    actionType: string;
    description: string;
    oldValue?: string;
    newValue?: string;
    performer?: {
      id: string;
      fullName: string;
    };
    createdAt: string;
  }[];
}

export interface Statistics {
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

export interface Notification {
  id: string;
  type: "warning" | "info" | "error" | "success";
  title: string;
  message: string;
  date: string;
  read: boolean;
}
