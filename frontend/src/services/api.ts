// Back to real Supabase with corrected URL!
export { SupabaseVaccineAPI as VaccineAPI } from './supabaseApi';

// Legacy Express.js API implementation (commented out for reference)
/*
import axios from 'axios';
import { ApiResponse, Vaccine, VaccineDetails, VaccineStats } from '../types/vaccine';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class VaccineAPI {
  static async getAllVaccines(): Promise<Vaccine[]> {
    try {
      const response = await api.get<ApiResponse<Vaccine[]>>('/vaccines');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      throw new Error('Failed to fetch vaccines');
    }
  }

  static async getVaccineById(id: number): Promise<VaccineDetails | null> {
    try {
      const response = await api.get<ApiResponse<VaccineDetails>>(`/vaccines/${id}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching vaccine ${id}:`, error);
      throw new Error('Failed to fetch vaccine details');
    }
  }

  static async getStats(): Promise<VaccineStats> {
    try {
      const response = await api.get<ApiResponse<VaccineStats>>('/vaccines/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }
}
*/