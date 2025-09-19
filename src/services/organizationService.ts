import { apiClient } from './api';
import { Organization, ExtendedOrganization, OrganizationRules } from '../types';

export interface CreateOrganizationRequest {
  name: string;
  description: string;
  image?: string;
  rules: OrganizationRules;
}

// Interface para o backend C# (PascalCase)
export interface CreateOrganizationRequestCSharp {
  Name: string;
  Description: string;
  Image?: string | null;
  Rules: {
    LoanDurationDays: number;
    MeetingFrequency: number;
    MeetingDay: number | null;
    MeetingWeek: number | null;
    MeetingTime: string | null;
    HasNextWeekMeeting: boolean;
    RequireCompleteUserInfo: boolean;
  };
  NextMeetingDate: string | null;
  CreatedBy: number;
  UpdatedBy: number;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {
  organizationId: number;
}

class OrganizationService {
  async getOrganizations(): Promise<ExtendedOrganization[]> {
    console.log('🏢 Buscando organizações na API...');
    console.log('🌐 URL completa: https://localhost:53735/api/v1/organizations');
    try {
      const result = await apiClient.get<ExtendedOrganization[]>('/organizations');
      console.log('✅ Organizações obtidas com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar organizações:', error);
      console.error('❌ Detalhes do erro:', error);
      throw error;
    }
  }

  async getOrganizationById(organizationId: number): Promise<ExtendedOrganization> {
    return await apiClient.get<ExtendedOrganization>(`/organizations/${organizationId}`);
  }

  async createOrganization(orgData: CreateOrganizationRequestCSharp): Promise<ExtendedOrganization> {
    console.log('🏢 Enviando dados para API:', JSON.stringify(orgData, null, 2));
    console.log('🌐 URL completa:', `/organizations`);
    
    try {
      const result = await apiClient.post<ExtendedOrganization>('/organizations', orgData);
      console.log('✅ Organização criada com sucesso:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Erro detalhado na criação:', error);
      console.error('❌ Status do erro:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);
      throw error;
    }
  }

  async updateOrganization(orgData: UpdateOrganizationRequest): Promise<ExtendedOrganization> {
    const { organizationId, ...data } = orgData;
    return await apiClient.put<ExtendedOrganization>(`/organizations/${organizationId}`, data);
  }

  async deleteOrganization(organizationId: number): Promise<void> {
    await apiClient.delete(`/organizations/${organizationId}`);
  }

  async joinOrganization(organizationId: number): Promise<void> {
    await apiClient.post(`/organizations/${organizationId}`);
  }

  async leaveOrganization(organizationId: number): Promise<void> {
    await apiClient.post(`/organizations/${organizationId}`);
  }

  async getOrganizationMembers(organizationId: number): Promise<any[]> {
    return await apiClient.get(`/organizations/${organizationId}/members`);
  }
}

export default new OrganizationService(); 