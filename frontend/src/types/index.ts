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

export interface Contract {
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
  status: 'active' | 'expired' | 'suspended';
  repairHistory: RepairHistory[];
}

export interface TimelineEntry {
  date: string;
  status: string;
  note: string;
}

export interface WarrantyRequest {
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
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
}
