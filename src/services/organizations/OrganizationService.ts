import { apiClient } from '../base/ApiClient';
import { 
  Organization, 
  ExtendedOrganization,
  CreateOrganizationRequest, 
  UpdateOrganizationRequest 
} from '../../types/api';

/**
 * Serviço de organizações consolidado
 * Centraliza todas as operações relacionadas às organizações
 */
export class OrganizationService {
  private readonly basePath = '/organizations';

  /**
   * Obtém todas as organizações
   */
  async getOrganizations(): Promise<Organization[]> {
    try {
      console.log('🏢 Buscando organizações...');
      
      const response = await apiClient.get<Organization[]>(this.basePath);
      
      console.log('✅ Organizações encontradas:', response.length);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar organizações:', error);
      throw error;
    }
  }

  /**
   * Obtém uma organização específica por ID
   */
  async getOrganizationById(organizationId: number): Promise<Organization> {
    try {
      console.log('🏢 Buscando organização:', organizationId);
      
      const response = await apiClient.get<Organization>(
        `${this.basePath}/${organizationId}`
      );
      
      console.log('✅ Organização encontrada:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar organização:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova organização
   */
  async createOrganization(orgData: CreateOrganizationRequest): Promise<Organization> {
    try {
      console.log('📝 Criando nova organização...', orgData.name);
      
      const response = await apiClient.post<Organization>(this.basePath, orgData);
      
      console.log('✅ Organização criada com sucesso:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar organização:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma organização existente
   */
  async updateOrganization(orgData: UpdateOrganizationRequest): Promise<Organization> {
    try {
      console.log('✏️ Atualizando organização:', orgData.id);
      
      const response = await apiClient.put<Organization>(
        `${this.basePath}/${orgData.id}`, 
        orgData
      );
      
      console.log('✅ Organização atualizada com sucesso:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar organização:', error);
      throw error;
    }
  }

  /**
   * Remove uma organização
   */
  async deleteOrganization(organizationId: number): Promise<void> {
    try {
      console.log('🗑️ Removendo organização:', organizationId);
      
      await apiClient.delete(`${this.basePath}/${organizationId}`);
      
      console.log('✅ Organização removida com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover organização:', error);
      throw error;
    }
  }

  /**
   * Entra em uma organização
   */
  async joinOrganization(organizationId: number): Promise<void> {
    try {
      console.log('🚪 Entrando na organização:', organizationId);
      
      await apiClient.post(`${this.basePath}/${organizationId}/join`);
      
      console.log('✅ Entrou na organização com sucesso');
    } catch (error) {
      console.error('❌ Erro ao entrar na organização:', error);
      throw error;
    }
  }

  /**
   * Sai de uma organização
   */
  async leaveOrganization(organizationId: number): Promise<void> {
    try {
      console.log('🚪 Saindo da organização:', organizationId);
      
      await apiClient.post(`${this.basePath}/${organizationId}/leave`);
      
      console.log('✅ Saiu da organização com sucesso');
    } catch (error) {
      console.error('❌ Erro ao sair da organização:', error);
      throw error;
    }
  }

  /**
   * Converte Organization para ExtendedOrganization
   * Adiciona dados estendidos que não vêm da API
   */
  convertToExtended(organization: Organization): ExtendedOrganization {
    return {
      ...organization,
      role: 'Member', // Default role
      isActive: true, // Default status
      regulations: [], // Default regulations
      stats: {
        totalBooks: 0, // Default stats
        activeLoans: 0,
        totalMembers: organization.memberCount,
        monthlyLoans: 0,
      },
    };
  }

  /**
   * Converte array de Organization para ExtendedOrganization
   */
  convertArrayToExtended(organizations: Organization[]): ExtendedOrganization[] {
    return organizations.map(org => this.convertToExtended(org));
  }
}

// Instância singleton
export const organizationService = new OrganizationService();
