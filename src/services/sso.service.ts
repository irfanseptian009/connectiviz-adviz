import api from "@/lib/api";

export interface SSOUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface SSOLoginResponse {
  accessToken: string;
  redirectUrl: string;
  user: SSOUser;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  requiresAuth?: boolean;
}

class SSOService {
  private readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  async login(email: string, password: string): Promise<SSOLoginResponse> {
    const response = await fetch(`${this.BASE_URL}/sso/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async validateToken(token: string): Promise<{ valid: boolean; user: SSOUser }> {
    const response = await fetch(`${this.BASE_URL}/sso/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    return response.json();
  }

  async getApplicationToken(application: string): Promise<{ accessToken: string }> {
    const { data } = await api.post('/sso/app-token', { application });
    return data;
  }

  async getAvailableApplications(): Promise<Application[]> {
    const response = await fetch(`${this.BASE_URL}/sso/applications`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  }

  openApplication(application: Application, ssoToken?: string) {
    if (application.requiresAuth === false) {
      // For applications like Naruku that don't require auth
      window.open(application.url, '_blank');
    } else {
      // For applications that require SSO token
      const url = ssoToken 
        ? `${application.url}?ssoToken=${ssoToken}`
        : application.url;
      window.open(url, '_blank');
    }
  }

  storeToken(token: string) {
    localStorage.setItem('sso-token', token);
  }

  getStoredToken(): string | null {
    return localStorage.getItem('sso-token');
  }

  removeToken() {
    localStorage.removeItem('sso-token');
  }
}

export const ssoService = new SSOService();
