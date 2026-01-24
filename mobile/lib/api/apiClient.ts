import axios, { AxiosInstance, AxiosError } from 'axios';
import { storage } from '../storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token using Supabase
            const { supabase } = await import('../supabaseClient');
            const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (session && !refreshError) {
              // Save new token
              await storage.setItem('auth_token', session.access_token);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
              return this.client(originalRequest);
            } else {
              // Refresh failed, clear auth
              await storage.removeItem('auth_token');
              await storage.removeItem('user_data');
            }
          } catch (refreshErr) {
            // Refresh failed, clear auth
            await storage.removeItem('auth_token');
            await storage.removeItem('user_data');
          }
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      return data.detail || data.message || 'An error occurred';
    }
    if (error.message) {
      return error.message;
    }
    return 'Network error occurred';
  }

  // Auth methods
  async register(email: string, password: string, name?: string) {
    const response = await this.client.post('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    });
    // Store token
    console.log('[API] Login response:', response.data);
    if (response.data.access_token) {
      await storage.setItem('auth_token', response.data.access_token);
      await storage.setItem('user_data', JSON.stringify(response.data.user));
      console.log('[API] Token and user data saved');
    }
    return response.data;
  }

  async logout() {
    try {
      await this.client.post('/api/auth/logout');
    } finally {
      await storage.removeItem('auth_token');
      await storage.removeItem('user_data');
    }
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // Persona methods
  async getPersonas() {
    const response = await this.client.get('/api/personas');
    // Transform backend response to frontend format
    return response.data.map((persona: any) => ({
      id: persona.id,
      name: persona.name,
      title: persona.title,
      location: persona.location || '',
      avatar: persona.avatar_url || `https://i.pravatar.cc/300?u=${persona.id}`,
      experience: persona.experience_level || 'Mid-Level',
      salaryRange: {
        min: persona.salary_min || 0,
        max: persona.salary_max || 0,
      },
      skills: persona.skills || [],
      resume: persona.cv_file_name ? {
        fileName: persona.cv_file_name,
        uploadedAt: new Date(persona.created_at),
      } : undefined,
      marketDemand: persona.market_demand || 'medium',
      globalMatches: persona.global_matches || 0,
      confidence: persona.confidence_score || 0,
    }));
  }

  async createPersona(personaData: any) {
    const response = await this.client.post('/api/personas', personaData);
    return response.data;
  }

  async getPersona(id: string) {
    const response = await this.client.get(`/api/personas/${id}`);
    const persona = response.data;
    
    console.log('[API Client] Raw persona from backend:', persona);
    console.log('[API Client] workHistory field (camelCase):', persona.workHistory);
    console.log('[API Client] workHistory type:', typeof persona.workHistory);
    console.log('[API Client] workHistory is array:', Array.isArray(persona.workHistory));
    
    // Backend sends camelCase due to Pydantic aliases - read them correctly
    const transformed = {
      id: persona.id,
      name: persona.name,
      title: persona.title,
      location: persona.location || '',
      avatar: persona.avatar || `https://i.pravatar.cc/300?u=${persona.id}`,
      experience: persona.experience || 'Mid-Level',
      salaryRange: {
        min: persona.salaryMin || 0,
        max: persona.salaryMax || 0,
      },
      skills: persona.skills || [],
      resume: persona.cvFileName ? {
        fileName: persona.cvFileName,
        uploadedAt: new Date(persona.createdAt),
      } : undefined,
      marketDemand: persona.marketDemand || 'medium',
      globalMatches: persona.globalMatches || 0,
      confidence: persona.confidence || 0,
      // New CV fields - backend sends these in camelCase!
      email: persona.email || undefined,
      phone: persona.phone || undefined,
      summary: persona.summary || undefined,
      roles: persona.roles || undefined,
      jobSearchLocation: persona.jobSearchLocation || undefined,
      education: persona.education || undefined,
      workHistory: persona.workHistory || undefined,
    };
    
    console.log('[API Client] Transformed persona:', transformed);
    console.log('[API Client] Transformed workHistory:', transformed.workHistory);
    
    return transformed;
  }

  async updatePersona(id: string, data: any) {
    const response = await this.client.put(`/api/personas/${id}`, data);
    return response.data;
  }

  async deletePersona(id: string) {
    const response = await this.client.delete(`/api/personas/${id}`);
    return response.data;
  }

  async activatePersona(id: string) {
    const response = await this.client.patch(`/api/personas/${id}/activate`);
    return response.data;
  }

  async uploadCv(file: File | Blob) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post('/api/personas/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async parseCv(file: File | Blob) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post('/api/personas/parse-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
