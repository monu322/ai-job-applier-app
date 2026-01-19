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

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, clear auth
          await storage.removeItem('auth_token');
          await storage.removeItem('user_data');
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
    return response.data;
  }

  async createPersona(personaData: any) {
    const response = await this.client.post('/api/personas', personaData);
    return response.data;
  }

  async getPersona(id: string) {
    const response = await this.client.get(`/api/personas/${id}`);
    return response.data;
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
