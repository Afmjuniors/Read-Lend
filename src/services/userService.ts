import { UserDTO } from '../types';
import { apiClient } from './api';

class UserService {
  /**
   * Busca os detalhes completos do usuário incluindo organizações, livros e empréstimos
   */
  async getUserDetails(): Promise<UserDTO> {
    console.log('👤 Buscando detalhes do usuário na API...');
    console.log('🌐 URL completa: https://localhost:53735/api/v1/User');
    
    try {
      const result = await apiClient.get<UserDTO>('/User');
      console.log('✅ Detalhes do usuário obtidos com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do usuário:', error);
      console.error('❌ Detalhes do erro:', error);
      throw error;
    }
  }

  /**
   * Busca os detalhes de um usuário específico por ID
   */
  async getUserDetailsById(userId: number): Promise<UserDTO> {
    console.log(`👤 Buscando detalhes do usuário ${userId} na API...`);
    console.log(`🌐 URL completa: https://localhost:53735/api/v1/User/${userId}`);
    
    try {
      const result = await apiClient.get<UserDTO>(`/User/${userId}`);
      console.log('✅ Detalhes do usuário obtidos com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do usuário:', error);
      console.error('❌ Detalhes do erro:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;
