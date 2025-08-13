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
  status: 'active' | 'expired' | 'suspended';
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
  role: 'admin' | 'manager' | 'technician';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyRequest {
  id: string;
  ticketNumber: string;
  serialNumber: string;
  customerName: string;
  issue: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
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
