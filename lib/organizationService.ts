import api from './api';
import { Organization, POSOrganization } from './types';

interface ApiResponse<T> {
  status: string;
  data: T;
  metaData?: {
    page: number;
    totalPages: number;
    perPage: number;
    total: number;
  };
  message?: string;
  success?: boolean;
}

interface QueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  filter_status?: string;
  sortCreatedAt?: 'asc' | 'desc';
}

export interface CreateOrganizationPayload {
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
  subscription: Organization['subscription'];
  limits: Organization['limits'];
  settings: Organization['settings'];
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone: string;
}

export const organizationService = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<Organization[]>>('/api/organization', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Organization>>(`/api/organization/${id}`);
    return response.data;
  },

  create: async (data: CreateOrganizationPayload) => {
    const response = await api.post<ApiResponse<{ organization: Organization; admin: unknown }>>(
      '/api/organization/create',
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<Organization>) => {
    const response = await api.put<ApiResponse<Organization>>(
      `/api/organization/update/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/api/organization/delete/${id}`);
    return response.data;
  },

  getAllPOS: async (params?: QueryParams) => {
    const response = await api.get<ApiResponse<POSOrganization[]>>('/api/organization/pos', { params });
    return response.data;
  },

  getPOSById: async (id: string) => {
    const response = await api.get<ApiResponse<POSOrganization>>(`/api/organization/pos/${id}`);
    return response.data;
  },

  createPOS: async (data: any) => {
    const response = await api.post<ApiResponse<{ organization: POSOrganization; admin: unknown }>>(
      '/api/organization/pos/create',
      data
    );
    return response.data;
  },

  updatePOS: async (id: string, data: Partial<POSOrganization>) => {
    const response = await api.put<ApiResponse<POSOrganization>>(
      `/api/organization/pos/update/${id}`,
      data
    );
    return response.data;
  },

  deletePOS: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/api/organization/pos/delete/${id}`);
    return response.data;
  },
};
