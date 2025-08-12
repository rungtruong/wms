export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  VOIDED = 'VOIDED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  ACTIVATED = 'ACTIVATED',
  EXPIRED = 'EXPIRED',
  VOIDED = 'VOIDED',
  REPAIRED = 'REPAIRED',
  REPLACED = 'REPLACED',
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  description?: string;
  category: string;
  warrantyMonths: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  contractNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  signedDate: Date;
  status: ContractStatus;
  totalValue: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  products?: ContractProduct[];
}

export interface ContractProduct {
  id: string;
  contractId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  contract?: Contract;
  product?: Product;
}

export interface Serial {
  id: string;
  serialNumber: string;
  productId: string;
  contractId: string;
  warrantyStartDate: Date;
  warrantyEndDate: Date;
  warrantyStatus: WarrantyStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  contract?: Contract;
  tickets?: Ticket[];
  warrantyHistory?: WarrantyHistory[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  serialId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  serial?: Serial;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  createdAt: Date;
  ticket?: Ticket;
}

export interface WarrantyHistory {
  id: string;
  serialId: string;
  actionType: ActionType;
  actionDate: Date;
  performedBy: string;
  description?: string;
  notes?: string;
  createdAt: Date;
  serial?: Serial;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateProductRequest {
  name: string;
  model: string;
  description?: string;
  category: string;
  warrantyMonths: number;
  price: number;
}

export interface UpdateProductRequest {
  name?: string;
  model?: string;
  description?: string;
  category?: string;
  warrantyMonths?: number;
  price?: number;
}

export interface CreateContractRequest {
  contractNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  signedDate: string;
  status?: ContractStatus;
  notes?: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateContractRequest {
  contractNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  signedDate?: string;
  status?: ContractStatus;
  notes?: string;
  products?: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface CreateSerialRequest {
  serialNumber: string;
  productId: string;
  contractId: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatus?: WarrantyStatus;
  notes?: string;
}

export interface UpdateSerialRequest {
  serialNumber?: string;
  productId?: string;
  contractId?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  warrantyStatus?: WarrantyStatus;
  notes?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  status?: TicketStatus;
  serialId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  serialId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CreateTicketCommentRequest {
  content: string;
  authorName: string;
  authorEmail?: string;
}

export interface CreateWarrantyHistoryRequest {
  serialId: string;
  actionType: ActionType;
  actionDate: string;
  performedBy: string;
  description?: string;
  notes?: string;
}

export interface UpdateWarrantyHistoryRequest {
  serialId?: string;
  actionType?: ActionType;
  actionDate?: string;
  performedBy?: string;
  description?: string;
  notes?: string;
}

export interface WarrantyCheckResponse {
  isValid: boolean;
  serial?: Serial;
  daysRemaining?: number;
  message: string;
}