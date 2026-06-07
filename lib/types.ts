// Organization and Business Types
export interface Organization {
  id: string;
  name: string;
  type: 'Individual' | 'Business' | 'Startup' | 'Enterprise';
  logo?: string;
  members: number;
  activePlan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: string;
  revenue: number;
}

export interface Client {
  id: string;
  name: string;
  organizationId: string;
  email: string;
  phone: string;
  package: 'Basic' | 'Standard' | 'Premium';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  renewalDate: string;
  totalSpent: number;
  totalProducts?: number;
  status?: 'Active' | 'Inactive' | 'Suspended';
  lastActivity?: string;
  totalCustomers?: number;
  notes?: string;
  companyName?: string;
  joinDate?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  clientId: string;
  organizationId: string;
  amount: number;
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'PayPal' | 'Check';
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
}

export interface Statistics {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

export interface ChartDataPoint {
  name: string;
  revenue?: number;
  income?: number;
  growth?: number;
  value?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Manager' | 'Viewer';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
