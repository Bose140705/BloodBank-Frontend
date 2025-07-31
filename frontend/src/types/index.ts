export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'hospital' | 'admin';
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bloodGroup?: string;
  dateOfBirth?: string;
  medicalHistory?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  hospitalLicense?: string;
  hospitalType?: 'government' | 'private' | 'charitable';
  capacity?: number;
  specializations?: string[];
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Donor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  weight: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory?: string;
  lastDonationDate?: string;
  totalDonations: number;
  isEligible: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BloodInventory {
  _id: string;
  bloodGroup: string;
  unitsAvailable: number;
  unitsReserved: number;
  expiryDate: string;
  donorId?: string;
  collectionDate: string;
  bloodBankLocation?: string;
  status: 'available' | 'reserved' | 'expired' | 'used';
  testResults: {
    hiv: 'negative' | 'positive';
    hepatitisB: 'negative' | 'positive';
    hepatitisC: 'negative' | 'positive';
    syphilis: 'negative' | 'positive';
  };
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  _id: string;
  requestId: string;
  patientId?: User;
  hospitalId?: User;
  bloodGroup: string;
  unitsNeeded: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  patientName: string;
  patientAge: number;
  reason?: string;
  requiredBy: string;
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected' | 'cancelled';
  approvedBy?: User;
  fulfilledBy?: BloodInventory[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationDrive {
  _id: string;
  title: string;
  description?: string;
  organizer: User;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  targetDonors: number;
  registeredDonors: number;
  completedDonations: number;
  requirements: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'donation_drive' | 'blood_request' | 'inventory_low' | 'general';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface DashboardStats {
  totalDonors: number;
  totalRequests: number;
  pendingRequests: number;
  criticalRequests: number;
  activeDrives: number;
  totalUsers: number;
  patients: number;
  hospitals: number;
}