import axios from 'axios';
import { 
  User, 
  Donor, 
  BloodInventory, 
  BloodRequest, 
  DonationDrive, 
  Notification,
  AuthResponse,
  PaginatedResponse,
  DashboardStats
} from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
export const authApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const auth = {
  login: (email: string, password: string) => 
    authApi.post<AuthResponse>('/auth/login', { email, password }),
  
  register: (userData: any) => 
    authApi.post<AuthResponse>('/auth/register', userData),
  
  getProfile: () => 
    authApi.get<User>('/auth/profile'),
  
  updateProfile: (userData: Partial<User>) => 
    authApi.put('/auth/profile', userData),
};

// Donor API
export const donors = {
  create: (donorData: Partial<Donor>) => 
    authApi.post<{ donor: Donor }>('/donors', donorData),
  
  getAll: (params?: { page?: number; limit?: number; bloodGroup?: string; city?: string; isEligible?: boolean }) => 
    authApi.get<PaginatedResponse<Donor>>('/donors', { params }),
  
  getById: (id: string) => 
    authApi.get<Donor>(`/donors/${id}`),
  
  update: (id: string, donorData: Partial<Donor>) => 
    authApi.put<{ donor: Donor }>(`/donors/${id}`, donorData),
  
  delete: (id: string) => 
    authApi.delete(`/donors/${id}`),
};

// Blood Inventory API
export const inventory = {
  create: (inventoryData: Partial<BloodInventory>) => 
    authApi.post<{ inventory: BloodInventory }>('/inventory', inventoryData),
  
  getAll: (params?: { bloodGroup?: string; status?: string; location?: string }) => 
    authApi.get<{ inventory: BloodInventory[]; summary: any }>('/inventory', { params }),
  
  update: (id: string, inventoryData: Partial<BloodInventory>) => 
    authApi.put<{ inventory: BloodInventory }>(`/inventory/${id}`, inventoryData),
  
  getCompatible: (bloodGroup: string, unitsNeeded?: number) => 
    authApi.get(`/inventory/compatible/${bloodGroup}`, { 
      params: { unitsNeeded } 
    }),
};

// Blood Request API
export const requests = {
  create: (requestData: any) => 
    authApi.post<{ request: BloodRequest }>('/requests', requestData),
  
  getAll: (params?: { page?: number; limit?: number; status?: string; urgency?: string; bloodGroup?: string }) => 
    authApi.get<PaginatedResponse<BloodRequest>>('/requests', { params }),
  
  getById: (id: string) => 
    authApi.get<BloodRequest>(`/requests/${id}`),
  
  updateStatus: (id: string, status: string, notes?: string) => 
    authApi.put(`/requests/${id}/status`, { status, notes }),
};

// Donation Drive API
export const drives = {
  create: (driveData: Partial<DonationDrive>) => 
    authApi.post<{ drive: DonationDrive }>('/drives', driveData),
  
  getAll: (params?: { page?: number; limit?: number; status?: string; city?: string; upcoming?: boolean }) => 
    authApi.get<PaginatedResponse<DonationDrive>>('/drives', { params }),
  
  getById: (id: string) => 
    authApi.get<DonationDrive>(`/drives/${id}`),
  
  update: (id: string, driveData: Partial<DonationDrive>) => 
    authApi.put<{ drive: DonationDrive }>(`/drives/${id}`, driveData),
  
  register: (id: string) => 
    authApi.post<{ drive: DonationDrive }>(`/drives/${id}/register`),
};

// Notification API
export const notifications = {
  getAll: (params?: { page?: number; limit?: number; unread?: boolean }) => 
    authApi.get<PaginatedResponse<Notification> & { unreadCount: number }>('/notifications', { params }),
  
  markAsRead: (id: string) => 
    authApi.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    authApi.put('/notifications/read-all'),
};

// Admin API
export const admin = {
  getDashboard: () => 
    authApi.get<{
      stats: DashboardStats;
      inventorySummary: any[];
      recentRequests: BloodRequest[];
      lowInventory: BloodInventory[];
    }>('/admin/dashboard'),
  
  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) => 
    authApi.get<PaginatedResponse<User>>('/admin/users', { params }),
  
  verifyHospital: (id: string, isVerified: boolean) => 
    authApi.put(`/admin/hospitals/${id}/verify`, { isVerified }),
  
  createNotification: (notificationData: any) => 
    authApi.post('/admin/notifications', notificationData),
};

// Reports API
export const reports = {
  getInventoryReport: (params?: { startDate?: string; endDate?: string; bloodGroup?: string }) => 
    authApi.get('/reports/inventory', { params }),
  
  getDonationStats: (params?: { year?: number }) => 
    authApi.get('/reports/donations', { params }),
  
  getRequestReport: (params?: { startDate?: string; endDate?: string; status?: string }) => 
    authApi.get('/reports/requests', { params }),
};

// Utility API
export const utils = {
  checkCompatibility: (donorBloodGroup: string, recipientBloodGroup: string) => 
    authApi.get(`/utils/compatibility/${donorBloodGroup}/${recipientBloodGroup}`),
  
  checkDonorEligibility: (eligibilityData: any) => 
    authApi.post('/utils/donor-eligibility', eligibilityData),
  
  healthCheck: () => 
    authApi.get('/health'),
};