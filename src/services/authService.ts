import api from '../config/api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const controller = "/AccessControl";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 AuthService: Iniciando login com:', credentials);
    try {
      const response = await api.post<AuthResponse>(controller+'/Authenticate', credentials);
      console.log('✅ AuthService: Login bem-sucedido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Erro no login:', error);
      throw error;
    }
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(controller+'/CreateUser', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/AccessControl/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(controller+'/me');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(controller+'/profile', userData);
    return response.data;
  }
}

export default new AuthService(); 