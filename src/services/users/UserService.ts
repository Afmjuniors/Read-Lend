import { apiClient } from '../base/ApiClient';
import { User, UserDTO } from '../../types/api';

/**
 * Serviço de usuários consolidado
 * Centraliza todas as operações relacionadas aos usuários
 */
export class UserService {
  private readonly basePath = '/User';

  /**
   * Obtém detalhes completos do usuário atual
   */
  async getUserDetails(): Promise<UserDTO> {
    try {
      console.log('👤 Buscando detalhes do usuário atual...');
      
      const response = await apiClient.get<UserDTO>(this.basePath);
      
      console.log('✅ Detalhes do usuário obtidos:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  }

  /**
   * Obtém detalhes de um usuário específico por ID
   */
  async getUserDetailsById(userId: number): Promise<UserDTO> {
    try {
      console.log('👤 Buscando detalhes do usuário:', userId);
      
      const response = await apiClient.get<UserDTO>(`${this.basePath}/${userId}`);
      
      console.log('✅ Detalhes do usuário obtidos:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      console.log('✏️ Atualizando perfil do usuário...');
      
      const response = await apiClient.put<User>(`${this.basePath}/profile`, userData);
      
      console.log('✅ Perfil atualizado com sucesso');
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Converte UserDTO para User (formato simplificado)
   */
  convertToUser(userDTO: UserDTO): User {
    return {
      userId: userDTO.userId,
      name: userDTO.name,
      email: userDTO.email,
      phone: userDTO.phone,
      address: userDTO.address,
      additionalInfo: userDTO.additionalInfo,
      image: userDTO.image,
      birthDay: userDTO.birthDay,
      createdAt: userDTO.createdAt,
      cultureInfo: 'pt-BR', // Default value
    };
  }

  /**
   * Converte array de UserDTO para User
   */
  convertArrayToUser(userDTOs: UserDTO[]): User[] {
    return userDTOs.map(dto => this.convertToUser(dto));
  }
}

// Instância singleton
export const userService = new UserService();
