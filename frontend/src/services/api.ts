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
    console.error('❌ API Response Error:', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    } else if (!error.response) {
      throw new Error('Network error - please check your connection');
    }
    
    throw error;
  }
);

export class VaccineAPI {
  // Get all vaccines
  static async getAllVaccines(): Promise<Vaccine[]> {
    try {
      const response = await api.get<ApiResponse<Vaccine[]>>('/vaccines');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch vaccines');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      throw this.handleError(error);
    }
  }

  // Get vaccine by ID with detailed information
  static async getVaccineById(id: number): Promise<VaccineDetails> {
    try {
      const response = await api.get<ApiResponse<VaccineDetails>>(`/vaccines/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch vaccine details');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching vaccine details:', error);
      throw this.handleError(error);
    }
  }

  // Search vaccines by name
  static async searchVaccines(searchTerm: string): Promise<Vaccine[]> {
    try {
      const response = await api.get<ApiResponse<Vaccine[]>>(`/vaccines/search/${encodeURIComponent(searchTerm)}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to search vaccines');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error searching vaccines:', error);
      throw this.handleError(error);
    }
  }

  // Get vaccine statistics
  static async getVaccineStats(): Promise<VaccineStats> {
    try {
      const response = await api.get<ApiResponse<VaccineStats>>('/vaccines/stats/overview');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch vaccine statistics');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching vaccine stats:', error);
      throw this.handleError(error);
    }
  }

  // Refresh FDA data (admin function)
  static async refreshFDAData(): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>('/vaccines/refresh-fda-data');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to refresh FDA data');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing FDA data:', error);
      throw this.handleError(error);
    }
  }

  // Health check
  static async healthCheck(): Promise<any> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw this.handleError(error);
    }
  }

  // Error handler
  private static handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    
    return new Error('An unexpected error occurred');
  }
}

export default api;

