// Organization and Business Types
export interface Organization {
  _id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  banner?: string;
  description?: string;
  establishedYear?: number;
  regNumber?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
  contactPerson?: {
    name?: string;
    designation?: string;
    phone?: string;
  };
  libraryType?: 'public' | 'private' | 'academic' | 'community' | 'personal';
  openingHours?: string;
  status: 'active' | 'inactive';
  subscription: {
    planName: 'starter' | 'professional' | 'premium';
    status: 'active' | 'expired' | 'cancelled';
    autoRenew: boolean;
    startDate: string;
    endDate?: string;
    amount: number;
  };
  limits: {
    books: number;
    members: number;
  };
  settings: {
    currency: string;
    timezone: string;
    language: 'en' | 'bn';
  };
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Plan {
  name: string;
  nameEn: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  limits: {
    books: number;
    members: number;
  };
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

export interface POSOrganization {
  _id: string;
  name: string;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
  ownerId?: any;
  logo?: string;
  subscription?: {
    planId?: string;
    planName?: string;
    status?: 'active' | 'trial' | 'expired' | 'cancelled';
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
    amount?: number;
  };
  limits?: {
    products?: number;
    users?: number;
    storageMB?: number;
  };
  settings?: {
    currency?: string;
    timezone?: string;
    language?: string;
  };
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}
