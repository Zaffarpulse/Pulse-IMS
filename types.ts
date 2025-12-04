

export enum Role {
  ADMIN = 'Admin',
  STORE_INCHARGE = 'Store Incharge',
  MEDICAL_INCHARGE = 'Medical Store Incharge',
  HK_INCHARGE = 'Housekeeping Incharge',
  ALLIED_INCHARGE = 'Allied Incharge',
  STAFF = 'Staff'
}

export enum Department {
  STORE = 'General Store',
  MEDICAL = 'Medical Store',
  HOUSEKEEPING = 'Housekeeping',
  ALLIED = 'Allied Services'
}

export enum RequestStatus {
  PENDING_ADMIN = 'Pending Admin Approval',
  APPROVED_ADMIN = 'Approved by Admin',
  REJECTED = 'Rejected',
  ISSUED = 'Issued / Completed'
}

export enum ItemStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  staffId: string; // Employee ID
  name: string;
  role: Role;
  department?: Department; // Primarily for Incharges (Managed Department)
  workDepartment?: string; // Actual Department from CSV (e.g., ICU, OPD)
  designation?: string;
  mobile?: string;
  email: string;
  avatar: string;
  password?: string; // For mock auth
  signatureUrl?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  category: string;
  email?: string;
  address?: string;
  phone?: string;
  gstNumber?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  department: Department;
  quantity: number;
  unit: string;
  minStock: number;
  vendor?: string; // Vendor Name
  vendorId?: string;
  expiryDate?: string; // Specific to Medical
  batchNumber?: string; // Specific to Medical
  location?: string; // Specific to Allied
  condition?: 'Good' | 'Needs Repair' | 'Broken'; // Specific to Allied
  
  // Extended fields for Inventory Manager
  serialNumber?: string;
  modelNumber?: string;
  status?: string;
  purchasePrice?: number;
  lastUpdated?: string;
  amcCmc?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  images?: string[];

  // Specific Fields for Medical Store Form
  rackNo?: string;
  focQuantity?: number;
  gstPercent?: number;
  mrp?: number;
  discount?: number;
  inputDiscount?: number;
}

export interface Requisition {
  id: string;
  requestType: 'Procurement' | 'Issue' | 'Repair' | 'Cleaning';
  requesterId: string;
  requesterName: string;
  requesterStaffId: string;
  departmentTarget: Department;
  itemId?: string;
  itemName: string;
  quantity?: number;
  priority?: 'Normal' | 'High';
  description?: string; // For repairs/cleaning
  status: RequestStatus;
  dateRequested: string;
  dateApproved?: string;
  dateIssued?: string;
  adminSignature?: boolean;
  inchargeSignature?: boolean;
  staffSignature?: boolean;
  logs: string[]; // Time trail
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  department: Department;
}

// Additional Types for specific modules
export interface PurchaseOrder {
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  items: { item_id: string; item_name: string; quantity: number; unit_price: number }[];
  total_amount: number;
  status: POStatus;
  created_date: string;
  expected_delivery_date: string;
}

export enum POStatus {
  PENDING_APPROVAL = 'Pending Approval',
  SENT_TO_VENDOR = 'Sent to Vendor',
  COMPLETED = 'Completed',
  DRAFT = 'Draft'
}

export interface Repair {
  id: string;
  item_id: string;
  item_name: string;
  issue_desc: string;
  vendor_name: string;
  cost: number;
  sent_date: string;
  status: RepairStatus;
}

export enum RepairStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface Contract {
    id: string;
    name: string;
    vendor_name: string;
    start_date: string;
    end_date: string;
    type: 'AMC' | 'CMC';
    status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface Issuance {
    id: string;
    item_id: string;
    item_name: string;
    issued_to: string; // Staff Name
    department: string;
    issue_date: string;
    status: 'Active' | 'Returned';
}

export interface StaffEntity {
  id: string;
  full_name: string;
  designation: string;
  department: string;
  employee_id: string;
  email: string;
  phone: string;
  is_active: boolean;
  role: UserRole;
  password?: string; // Added for login logic
  signatureUrl?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STORE_INCHARGE = 'STORE_INCHARGE',
  MEDICAL_INCHARGE = 'MEDICAL_INCHARGE',
  HOUSEKEEPING_INCHARGE = 'HOUSEKEEPING_INCHARGE',
  ALLIED_INCHARGE = 'ALLIED_INCHARGE',
  STAFF = 'STAFF'
}

export enum RequisitionStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ISSUED = 'Issued'
}
