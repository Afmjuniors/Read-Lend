import { apiClient } from '../base/ApiClient';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../../types/api';

/**
 * Serviço de autenticação consolidado
 * Centraliza todas as operações relacionadas à autenticação
 */
export class AuthService {
  private readonly basePath = '/AccessControl';

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Iniciando login...');
      
      const response = await apiClient.post<AuthResponse>(
        `${this.basePath}/Authenticate`, 
        credentials
      );

      // Salvar token automaticamente
      if (response.token) {
        await apiClient.saveToken(response.token);
        console.log('🔐 Token salvo com sucesso');
      }

      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Iniciando cadastro...');
      
      const response = await apiClient.post<AuthResponse>(
        `${this.basePath}/CreateUser`, 
        userData
      );

      // Salvar token automaticamente
      if (response.token) {
        await apiClient.saveToken(response.token);
        console.log('🔐 Token salvo com sucesso (signup)');
      }

      return response;
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 Realizando logout...');
      
      await apiClient.post(`${this.basePath}/logout`);
      await apiClient.clearToken();
      
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar o token local
      await apiClient.clearToken();
      throw error;
    }
  }

  /**
   * Obtém dados do usuário atual
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('👤 Obtendo dados do usuário atual...');
      
      const response = await apiClient.get<User>(`${this.basePath}/me`);
      return response;
    } catch (error) {
      console.error('❌ Erro ao obter usuário atual:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      console.log('✏️ Atualizando perfil...');
      
      const response = await apiClient.put<User>(
        `${this.basePath}/profile`, 
        userData
      );
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}

// Instância singleton
export const authService = new AuthService();
