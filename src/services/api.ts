import { User, LoginResult, Book } from '../types';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Interface para resposta da API de autenticação
interface AuthApiResponse {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  additionalInfo?: string;
  image?: string;
  birthDay?: string;
  createdAt?: string;
  cultureInfo?: string;
  token?: string;
}

// Serviço de autenticação com fallback para web
const authTokenService = {
  async getToken(): Promise<string | null> {
    try {
      let token: string | null = null;
      
      if (Platform.OS === 'web') {
        // Fallback para web usando localStorage
        token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        console.log('🌐 Token obtido do localStorage:', token ? token.substring(0, 20) + '...' : 'null');
      } else {
        // Mobile usando SecureStore
        token = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
        console.log('📱 Token obtido do SecureStore:', token ? token.substring(0, 20) + '...' : 'null');
      }
      
      return token;
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fallback para web usando localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        console.log('🌐 Token salvo no localStorage:', token.substring(0, 20) + '...');
      } else {
        // Mobile usando SecureStore
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
        console.log('📱 Token salvo no SecureStore:', token.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fallback para web usando localStorage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } else {
        // Mobile usando SecureStore
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      }
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  },
};

// Headers padrão sempre com Content-Type
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// Função para adicionar token aos headers
const addTokenToHeaders = async (headers: Record<string, string>) => {
  const token = await authTokenService.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Token adicionado:', `Bearer ${token.substring(0, 20)}...`);
  }
  return headers;
};

// Cliente HTTP customizado
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Headers padrão sempre com Content-Type
    const headers = getDefaultHeaders();
    
    // Adicionar token se disponível
    await addTokenToHeaders(headers);
    
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
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      console.log('🌐 Fazendo requisição para:', url);
      console.log('📤 Headers finais:', finalHeaders);
      console.log('📦 Body da requisição:', config.body);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Resposta de erro do servidor:', errorText);
        console.error('❌ Status:', response.status);
        console.error('❌ Headers da resposta:', response.headers);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Métodos HTTP
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
}

// Instância do cliente API
const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Serviços específicos
export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      console.log('🔗 Iniciando chamada para API...');
      console.log('📧 Email:', email);

      const data = await apiClient.post<AuthApiResponse>('/AccessControl/Authenticate', {
        email,
        password,
      });

      console.log('📦 Dados da resposta:', JSON.stringify(data, null, 2));

      if (data && data.userId && data.name && data.email) {
        const userData: User = {
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          additionalInfo: data.additionalInfo,
          image: data.image,
          birthDay: data.birthDay,
          createdAt: data.createdAt,
          cultureInfo: data.cultureInfo,
        };

        // Salvar token se disponível
        if (data.token) {
          await authTokenService.setToken(data.token);
          console.log('🔐 Token salvo com sucesso:', data.token.substring(0, 20) + '...');
        } else {
          console.log('⚠️ Nenhum token recebido da API');
        }

        return {
          success: true,
          data: {
            user: userData,
            token: data.token || 'dummy-token',
          },
        };
      } else {
        console.log('❌ Login falhou na API: Sem mensagem de erro');
        return {
          success: false,
          message: 'Login falhou',
        };
      }
    } catch (error) {
      console.error('❌ Erro na API:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro inesperado',
      };
    }
  },

  async signup(userData: any): Promise<LoginResult> {
    try {
      console.log('🔗 Iniciando chamada para API...');
      console.log('📦 Dados do usuário:', userData);
      const data = await apiClient.post<AuthApiResponse>('/AccessControl/CreateUser', userData);
      
      if (data && data.userId && data.name && data.email) {
        const user: User = {
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          additionalInfo: data.additionalInfo,
          image: data.image,
          birthDay: data.birthDay,
          createdAt: data.createdAt,
          cultureInfo: data.cultureInfo,
        };

        // Salvar token se disponível
        if (data.token) {
          await authTokenService.setToken(data.token);
          console.log('🔐 Token salvo com sucesso (signup)');
        }

        return {
          success: true,
          data: {
            user,
            token: data.token || 'dummy-token',
          },
        };
      } else {
        return {
          success: false,
          message: 'Signup failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro inesperado',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await authTokenService.removeToken();
      console.log('🔐 Token removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover token:', error);
    }
  },
};

// Interfaces para a API de livros
interface SearchBookParamsDTO {
  keyWord?: string;
  userId?: number;
  ownerId?: number;
  organizationId?: number;
  userName?: string;
  author?: string;
  genre?: number;
  bookStatus?: number;
  loanStatus?: number;
}

interface BookPageMessage {
  actualPage: number;
  startIndex: number;
  pageSize: number;
  rowsCount: number;
  totalPages: number;
  order: Record<string, string>;
  filter?: SearchBookParamsDTO;
}

interface BookSearchResponse {
  data: Book[];
  actualPage: number;
  pageSize: number;
  rowsCount: number;
  totalPages: number;
}

export const bookService = {
  async searchBooks(searchParams: SearchBookParamsDTO = {}, page = 1, pageSize = 20): Promise<BookSearchResponse> {
    const bookPageMessage: BookPageMessage = {
      actualPage: page,
      startIndex: (page - 1) * pageSize,
      pageSize,
      rowsCount: 0,
      totalPages: 0,
      order: { name: 'asc' }, // Ordenação padrão
      filter: searchParams,
    };

    return apiClient.post<BookSearchResponse>('/books/Search', bookPageMessage);
  },

  async getUserBooks(userId: number): Promise<Book[]> {
    return apiClient.get<Book[]>(`/books/User/${userId}`);
  },

  async getAllBooks(page = 1, pageSize = 20): Promise<BookSearchResponse> {
    return this.searchBooks({}, page, pageSize);
  },

  async addBook(bookData: any) {
    return apiClient.post('/books', bookData);
  },

  async updateBook(bookId: number, bookData: any) {
    return apiClient.put(`/books/${bookId}`, bookData);
  },

  async deleteBook(bookId: number) {
    return apiClient.delete(`/books/${bookId}`);
  },
};

export const userService = {
  async getUserProfile(userId: number) {
    return apiClient.get(`/users/${userId}`);
  },

  async updateUserProfile(userId: number, userData: any) {
    return apiClient.put(`/users/${userId}`, userData);
  },
};

// Exportar o cliente para uso direto se necessário
export { apiClient };

// Exportar como apiService para compatibilidade
export const apiService = {
  auth: authService,
  books: bookService,
  users: userService,
  client: apiClient,
  token: authTokenService,
}; 