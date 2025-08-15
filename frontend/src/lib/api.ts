interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.token = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log('🔍 [ApiClient] handleResponse - status:', response.status);
    if (!response.ok) {
      console.log('❌ [ApiClient] Response not ok, status:', response.status);
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || 'An error occurred',
        status: response.status,
        code: errorData.code
      };
      
      if (response.status === 401) {
        console.log('❌ [ApiClient] Unauthorized, redirecting to login');
        this.setToken(null);
        window.location.href = '/login';
      }
      
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      console.log('🔍 [ApiClient] JSON response:', jsonData);
      return jsonData;
    }
    
    const textData = await response.text();
    console.log('🔍 [ApiClient] Text response:', textData);
    return textData as any;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    console.log('🔍 [ApiClient] GET request to:', url.toString());
    console.log('🔍 [ApiClient] Headers:', this.getHeaders());
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    console.log('🔍 [ApiClient] Response status:', response.status);

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    console.log('🔍 [ApiClient] POST request to:', `${this.baseURL}${endpoint}`);
    console.log('🔍 [ApiClient] Headers:', this.getHeaders());
    console.log('🔍 [ApiClient] Data:', data);
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log('🔍 [ApiClient] Response status:', response.status);

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };