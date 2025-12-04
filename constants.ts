
import { InventoryItem, ItemStatus, PurchaseOrder, POStatus, Requisition, RequestStatus, Vendor, Repair, RepairStatus, StaffEntity, UserRole, Contract, Issuance, Category, Department, Role } from './types';

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'MedSupply Corp', contactPerson: 'John Doe', email: 'john@medsupply.com', mobile: '555-0101', category: 'Medical', address: '123 Medical Lane', gstNumber: '01AAQFP2153D1ZN' },
  { id: 'v2', name: 'Global Pharma', contactPerson: 'Jane Smith', email: 'jane@globalpharma.com', mobile: '555-0102', category: 'Pharma', address: '456 Global Way', gstNumber: '07AAQFP2153D1Z1' },
  { id: 'v3', name: 'TechSurgical', contactPerson: 'Bob Wilson', email: 'orders@techsurgical.com', mobile: '555-0103', category: 'Surgical', address: '789 Tech Blvd', gstNumber: '03AAQFP2153D1Z3' },
  { id: 'v4', name: 'KAZMI STATIONARY', contactPerson: 'Kazmi', email: 'kazmi@example.com', mobile: '555-0104', category: 'Stationery', gstNumber: '09AAQFP2153D1Z4' },
  { id: 'v5', name: 'EVA TRADERS', contactPerson: 'Eva', email: 'eva@example.com', mobile: '6006251087', category: 'General', gstNumber: '01ILMPS3037J1ZU' },
  { id: 'v6', name: 'MISSC', contactPerson: 'Missc', email: 'missc@example.com', mobile: '555-0106', category: 'Misc', gstNumber: '02AAQFP2153D1Z6' },
  { id: 'v7', name: 'MEDISERVE SOLUTIONS', contactPerson: 'Mediserve', email: 'support@mediserve.com', mobile: '555-0107', category: 'Services', gstNumber: '05AAQFP2153D1Z7' },
  { id: 'v8', name: 'PEGASUS BUSINESS SOLUTIONS', contactPerson: 'Manager', email: 'pegasus@example.com', mobile: '8908577779', category: 'Business', gstNumber: '01AAQFP2153D1ZN' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'General', description: 'General hospital supplies' },
  { id: 'cat-2', name: 'Medical Equipment', description: 'Machinery and medical devices' },
  { id: 'cat-3', name: 'HOUSEKEEPING ITEMS', description: 'Cleaning, Linen, and Sanitation' },
  { id: 'cat-4', name: 'STATIONARY', description: 'Office and paperwork supplies' },
  { id: 'cat-5', name: 'ELECTRICAL', description: 'Electrical components and devices' },
  { id: 'cat-6', name: 'Networking', description: 'IT and Network infrastructure' },
  { id: 'cat-7', name: 'BIO MEDICAL WASTE MANAGMENT', description: 'Waste disposal items' },
  { id: 'cat-8', name: 'Pharmaceuticals', description: 'Medicines and drugs' },
  { id: 'cat-9', name: 'Other', description: 'Miscellaneous items' }
];

export const MOCK_STAFF: StaffEntity[] = [
  { id: '1', full_name: 'SOHAIL QASIM', employee_id: '1', designation: 'M.D', department: 'ADMINISTRATIVE', email: 'ZAFFARABASS3@GMAIL.COM', phone: '7860000097', role: UserRole.ADMIN, is_active: true, password: '1' },
  { id: '10', full_name: 'ZAFFAR ABASS RISHI', employee_id: '10', designation: 'MANAGER', department: 'ADMINISTRATIVE', email: 'ZAFFARABASS3@GMAIL.COM', phone: '9858703786', role: UserRole.ADMIN, is_active: true, password: '10' },
  { id: '260', full_name: 'Rohit sharma', employee_id: '260', designation: 'Front desk', department: 'ADMINISTRATIVE', email: 'Rohitsharma1234452@gmail.con', phone: '8492926009', role: UserRole.STAFF, is_active: true, password: '260' },
  { id: '169', full_name: 'Muzaffer ahmed', employee_id: '169', designation: 'Pharmacist', department: 'PHARMACY', email: 'muzafferahmed2001@gmail.com', phone: '7051032160', role: UserRole.MEDICAL_INCHARGE, is_active: true, password: '169' },
  { id: '83', full_name: 'Hilal ahmed tak', employee_id: '83', designation: 'Supervisor', department: 'ADMINISTRATIVE', email: 'Hilal.tak489@gmail.com', phone: '9697197960', role: UserRole.STORE_INCHARGE, is_active: true, password: '83' },
  { id: 'hk-1', full_name: 'Suresh Kumar', employee_id: 'HK01', designation: 'Housekeeping Supervisor', department: 'HOUSEKEEPING', email: 'hk@pulse.com', phone: '9999999999', role: UserRole.HOUSEKEEPING_INCHARGE, is_active: true, password: 'HK01' },
  { id: 'allied-1', full_name: 'Amit Singh', employee_id: 'AL01', designation: 'Allied Manager', department: 'ALLIED', email: 'allied@pulse.com', phone: '8888888888', role: UserRole.ALLIED_INCHARGE, is_active: true, password: 'AL01' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'WHITNER', serialNumber: 'SN-1764486712021-Q9C07Q', modelNumber: '', category: 'Other', department: Department.STORE, quantity: 10, unit: 'pcs', minStock: 5, location: '', vendorId: 'v4', status: ItemStatus.IN_STOCK, purchasePrice: 10, lastUpdated: '2025-11-30', amcCmc: 'None' },
  { id: 'inv-2', name: 'DIARY', serialNumber: 'SN-1764486711379-OYABHW', modelNumber: '', category: 'Other', department: Department.STORE, quantity: 10, unit: 'pcs', minStock: 5, location: '', vendorId: 'v4', status: ItemStatus.IN_STOCK, purchasePrice: 200, lastUpdated: '2025-11-30', amcCmc: 'None' },
  { id: 'inv-3', name: 'Class V Integrator for Steam', serialNumber: 'A000498', modelNumber: '', category: 'Medical Equipment', department: Department.MEDICAL, quantity: 0, unit: 'roll', minStock: 5, location: '', vendorId: 'v5', status: ItemStatus.OUT_OF_STOCK, purchasePrice: 0, lastUpdated: '2025-11-24', amcCmc: 'None' },
  { id: 'inv-4', name: 'FLITE SLIPPERS NO 10', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 2, unit: 'pair', minStock: 1, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-19', amcCmc: 'None' },
  { id: 'inv-5', name: 'FLITE SLIPPERS NO 8', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 2, unit: 'pair', minStock: 1, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-19', amcCmc: 'None' },
  { id: 'inv-6', name: 'FLITE SLIPPERS NO 7', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 10, unit: 'pair', minStock: 2, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-19', amcCmc: 'None' },
  { id: 'inv-7', name: 'FLITE SLIPPERS NO 6', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 6, unit: 'pair', minStock: 1, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-19', amcCmc: 'None' },
  { id: 'inv-8', name: 'SLIPPERS', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 10, unit: 'pair', minStock: 5, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-9', name: 'BEETEL FIXED LANDLINE', serialNumber: '356041540065608', modelNumber: 'FWP F1-4G', category: 'Networking', department: Department.ALLIED, quantity: 0, unit: 'pcs', minStock: 0, location: 'STORE', vendorId: 'v6', status: ItemStatus.OUT_OF_STOCK, purchasePrice: 4000, lastUpdated: '2025-11-21', amcCmc: 'AMC', contractEndDate: '2026-11-22' },
  { id: 'inv-10', name: 'MICROTEK LEGEND 1000', serialNumber: 'NY80U1604XOSGKEJJ2', modelNumber: 'MTKUY1K', category: 'ELECTRICAL', department: Department.ALLIED, quantity: 1, unit: 'pcs', minStock: 2, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-11', name: 'MICROTEK LEGEND 650', serialNumber: 'TX90U110460VYAM7WV', modelNumber: 'MTKUR65', category: 'ELECTRICAL', department: Department.ALLIED, quantity: 1, unit: 'pcs', minStock: 2, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-12', name: 'FLITE CROCS 6 NO', serialNumber: '000', modelNumber: '', category: 'HOUSEKEEPING ITEMS', department: Department.HOUSEKEEPING, quantity: 0, unit: 'pair', minStock: 1, location: '', vendorId: '', status: ItemStatus.OUT_OF_STOCK, purchasePrice: 0, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-13', name: 'UPS FOR USG & STORE', serialNumber: 'USE', modelNumber: '', category: 'Other', department: Department.ALLIED, quantity: 2, unit: 'pcs', minStock: 5, location: '', vendorId: 'v6', status: ItemStatus.IN_STOCK, purchasePrice: 3500.02, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-14', name: 'OPD BELLS', serialNumber: '.', modelNumber: '', category: 'Other', department: Department.ALLIED, quantity: 5, unit: 'pcs', minStock: 5, location: '', vendorId: 'v6', status: ItemStatus.IN_STOCK, purchasePrice: 300, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-15', name: 'CROCS', serialNumber: 'FOR STOCK', modelNumber: '', category: 'Other', department: Department.STORE, quantity: 15, unit: 'pair', minStock: 5, location: '', vendorId: 'v6', status: ItemStatus.IN_STOCK, purchasePrice: 250, lastUpdated: '2025-11-18', amcCmc: 'None' },
  { id: 'inv-16', name: 'BPL ECG PAPER', serialNumber: '000', modelNumber: '', category: 'Medical Equipment', department: Department.MEDICAL, quantity: 9, unit: 'roll', minStock: 5, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-09-12', amcCmc: 'None' },
  { id: 'inv-17', name: 'CLASSMATE NOTEBOOK', serialNumber: '000', modelNumber: '', category: 'STATIONARY', department: Department.STORE, quantity: 38, unit: 'pcs', minStock: 5, location: '', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-10-11', amcCmc: 'None' },
  { id: 'inv-121', name: 'MULTIPARA MONITOR', serialNumber: '2K25050040R02ML', modelNumber: 'LIBRA-BR-125', category: 'Medical Equipment', department: Department.MEDICAL, quantity: 1, unit: 'pcs', minStock: 2, location: 'STORE / RAC- 5', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-10-25', amcCmc: 'None' },
  { id: 'inv-122', name: 'MANMAN DRIL', serialNumber: 'J263', modelNumber: 'RSO 50512', category: 'Medical Equipment', department: Department.MEDICAL, quantity: 0, unit: 'pcs', minStock: 0, location: 'SHELF 5', vendorId: '', status: ItemStatus.IN_STOCK, purchasePrice: 0, lastUpdated: '2025-10-25', amcCmc: 'None' },
];

export const MOCK_POS: PurchaseOrder[] = [
  {
    po_number: 'PO-2023-1001',
    vendor_id: 'v1',
    vendor_name: 'MedSupply Corp',
    items: [
       { item_id: 'inv-20', item_name: 'SCHILLER TRUSCOPE M10 MONITOR', quantity: 1, unit_price: 45000 }
    ],
    total_amount: 45000,
    status: POStatus.COMPLETED,
    created_date: '2025-10-15',
    expected_delivery_date: '2025-10-20'
  },
  {
    po_number: 'PO-2023-1002',
    vendor_id: 'v2',
    vendor_name: 'Global Pharma',
    items: [
       { item_id: 'inv-24', item_name: 'SPO2 PROBE', quantity: 5, unit_price: 1200 }
    ],
    total_amount: 6000,
    status: POStatus.PENDING_APPROVAL,
    created_date: '2025-11-28',
    expected_delivery_date: '2025-12-05'
  }
];

export const MOCK_REQUISITIONS: Requisition[] = [
  {
    id: 'REQ-001',
    requestType: 'Issue',
    requesterId: 'u2',
    requesterName: 'Staff Nurse A',
    requesterStaffId: 'SNA',
    departmentTarget: Department.STORE,
    itemName: 'SPO2 PROBE',
    quantity: 2,
    priority: 'High',
    status: RequestStatus.PENDING_ADMIN,
    dateRequested: '2025-11-29',
    logs: []
  },
  {
    id: 'REQ-002',
    requestType: 'Issue',
    requesterId: 'u3',
    requesterName: 'Dr. Strange',
    requesterStaffId: 'DRS',
    departmentTarget: Department.STORE,
    itemName: 'GOWNS',
    quantity: 50,
    priority: 'Normal',
    status: RequestStatus.APPROVED_ADMIN,
    dateRequested: '2025-11-25',
    logs: []
  }
];

export const MOCK_REPAIRS: Repair[] = [
  {
    id: 'rep-001',
    item_id: 'inv-21',
    item_name: 'MASIMO RADICAL MONITOR',
    issue_desc: 'Display malfunction',
    vendor_name: 'MedServe Tech',
    cost: 2500,
    sent_date: '2025-11-10',
    status: RepairStatus.IN_PROGRESS
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'con-001',
    name: 'CCTV Annual Maintenance',
    vendor_name: 'SecureEye Systems',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    type: 'AMC',
    status: 'Active'
  },
  {
     id: 'con-002',
     name: 'BEETEL LANDLINE SUPPORT',
     vendor_name: 'MISSC',
     start_date: '2024-11-22',
     end_date: '2025-11-22',
     type: 'AMC',
     status: 'Expiring Soon'
  }
];

export const MOCK_ISSUANCES: Issuance[] = [
  {
    id: 'iss-001',
    item_id: 'inv-15',
    item_name: 'CROCS',
    issued_to: 'Staff B',
    department: 'ICU',
    issue_date: '2025-11-20',
    status: 'Active'
  }
];
