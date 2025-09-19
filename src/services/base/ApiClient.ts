import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, STORAGE_KEYS } from '../../constants';

/**
 * Cliente HTTP base para todas as requisições da API
 * Gerencia tokens, headers e tratamento de erros de forma centralizada
 */
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Serviço de gerenciamento de tokens com suporte multiplataforma
   */
  private tokenService = {
    async getToken(): Promise<string | null> {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(STORAGE_KEYS.TOKEN);
        } else {
          return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
        }
      } catch (error) {
        console.error('❌ Erro ao obter token:', error);
        return null;
      }
    },

    async setToken(token: string): Promise<void> {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        } else {
          await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
        }
      } catch (error) {
        console.error('❌ Erro ao salvar token:', error);
      }
    },

    async removeToken(): Promise<void> {
      try {
        if (Platform.OS === 'web') {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
        } else {
          await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
        }
      } catch (error) {
        console.error('❌ Erro ao remover token:', error);
      }
    },
  };

  /**
   * Headers padrão para todas as requisições
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Adiciona token de autenticação aos headers
   */
  private async addAuthHeaders(headers: Record<string, string>): Promise<Record<string, string>> {
    const token = await this.tokenService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Método base para fazer requisições HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Preparar headers
    const headers = this.getDefaultHeaders();
    await this.addAuthHeaders(headers);
    
    // Mesclar com headers customizados
    const finalHeaders = {
      ...headers,
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers: finalHeaders,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      console.log('🌐 Fazendo requisição para:', url);
      console.log('📤 Headers:', finalHeaders);
      console.log('📦 Body:', config.body);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro do servidor:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Erro na requisição (${endpoint}):`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout da requisição');
      }
      throw error;
    }
  }

  /**
   * Métodos HTTP públicos
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * Métodos públicos para gerenciamento de tokens
   */
  async saveToken(token: string): Promise<void> {
    await this.tokenService.setToken(token);
  }

  async clearToken(): Promise<void> {
    await this.tokenService.removeToken();
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient();
