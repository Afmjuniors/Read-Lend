import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { ExtendedOrganization, Organization, OrganizationRules } from '../types';
import organizationService from '../services/organizationService';
import { DAY_MAP } from '../constants';

// Funções para converter enums de string para int (conforme esperado pelo C#)
const convertMeetingFrequencyToInt = (frequency: string): number => {
  const frequencyMap: { [key: string]: number } = {
    'na': 0,
    'daily': 1,
    'weekly': 2,
    'biweekly': 3,
    'monthly': 4,
  };
  return frequencyMap[frequency] ?? 0; // Default para 'na' se não encontrar
};

const convertMeetingDayToInt = (day: string | undefined): number | null => {
  if (!day) return null;
  return DAY_MAP[day as keyof typeof DAY_MAP] ?? null;
};

// Função para calcular a próxima reunião baseada nas regras
const calculateNextMeeting = (rules: OrganizationRules | null): Date | null => {
  const today = new Date();
  
  // Se não há regras ou não há reuniões regulares
  if (!rules || rules.meetingFrequency === 'na') {
    return null;
  }
  
  // Reuniões diárias (dias úteis)
  if (rules.meetingFrequency === 'daily') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Se amanhã é fim de semana, pular para segunda-feira
    const dayOfWeek = tomorrow.getDay();
    if (dayOfWeek === 0) { // Domingo
      tomorrow.setDate(tomorrow.getDate() + 1); // Segunda-feira
    } else if (dayOfWeek === 6) { // Sábado
      tomorrow.setDate(tomorrow.getDate() + 2); // Segunda-feira
    }
    
    return tomorrow;
  }
  
  // Reuniões semanais
  if (rules.meetingFrequency === 'weekly' && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Próxima semana
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysToAdd);
    return nextMeeting;
  }
  
  // Reuniões quinzenais
  if (rules.meetingFrequency === 'biweekly' && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Próxima semana
    }
    
    // Se a próxima semana não terá reunião, adicionar mais 7 dias
    if (rules.nextWeekMeeting === false) {
      daysToAdd += 7;
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysToAdd);
    return nextMeeting;
  }
  
  // Reuniões mensais
  if (rules.meetingFrequency === 'monthly' && rules.meetingWeek && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const targetWeek = rules.meetingWeek;
    
    // Calcular o primeiro dia do próximo mês
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    // Encontrar o primeiro dia da semana desejada no próximo mês
    let firstTargetDay = new Date(nextMonth);
    const firstDayOfMonth = nextMonth.getDay();
    let daysToFirstTarget = targetDay - firstDayOfMonth;
    if (daysToFirstTarget < 0) daysToFirstTarget += 7;
    
    firstTargetDay.setDate(1 + daysToFirstTarget);
    
    // Adicionar as semanas necessárias
    const targetDate = new Date(firstTargetDay);
    targetDate.setDate(firstTargetDay.getDate() + (targetWeek - 1) * 7);
    
    // Se a data calculada já passou, ir para o próximo mês
    if (targetDate <= today) {
      targetDate.setMonth(targetDate.getMonth() + 1);
      const nextNextMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      let nextFirstTargetDay = new Date(nextNextMonth);
      const nextFirstDayOfMonth = nextNextMonth.getDay();
      let nextDaysToFirstTarget = targetDay - nextFirstDayOfMonth;
      if (nextDaysToFirstTarget < 0) nextDaysToFirstTarget += 7;
      
      nextFirstTargetDay.setDate(1 + nextDaysToFirstTarget);
      nextFirstTargetDay.setDate(nextFirstTargetDay.getDate() + (targetWeek - 1) * 7);
      return nextFirstTargetDay;
    }
    
    return targetDate;
  }
  
  return null;
};

// Funções utilitárias para formatação de data
const formatNextMeetingDate = (date: Date | null): string => {
  if (!date) return 'Não há reuniões programadas';
  
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays < 7) return `Em ${diffDays} dias`;
  if (diffDays < 30) return `Em ${Math.ceil(diffDays / 7)} semanas`;
  
  return date.toLocaleDateString('pt-BR');
};

const formatNextMeetingDetail = (date: Date | null): string => {
  if (!date) return '';
  
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

interface CreateOrganizationData {
  name: string;
  description: string;
  image: string | null;
  rules: OrganizationRules;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<ExtendedOrganization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<ExtendedOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar organizações da API
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        console.log('🏢 Carregando organizações da API...');
        
        const organizationsData = await organizationService.getOrganizations();
        console.log('📥 Organizações carregadas:', organizationsData.length);
        console.log('📥 Dados das organizações:', organizationsData);
        
        setOrganizations(organizationsData);
        console.log('✅ Organizações carregadas com sucesso');
      } catch (error) {
        console.error('❌ Erro ao carregar organizações da API:', error);
        Alert.alert('Erro', 'Falha ao carregar organizações. Tente novamente.');
        setOrganizations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  const createOrganization = useCallback(async (data: CreateOrganizationData, creatorId: number) => {
    if (!data.name.trim()) {
      Alert.alert('Erro', 'Nome da organização é obrigatório');
      return null;
    }

    if (!data.description.trim()) {
      Alert.alert('Erro', 'Descrição da organização é obrigatória');
      return null;
    }

    try {
      console.log('🏢 Criando organização na API...');
      console.log('📋 Dados recebidos:', data);
      console.log('👤 Creator ID:', creatorId);
      
      // Validar regras antes de enviar
      if (!data.rules || typeof data.rules !== 'object') {
        throw new Error('Regras da organização são obrigatórias');
      }
      
      // Calcular a próxima reunião baseada nas regras
      const nextMeetingDate = calculateNextMeeting(data.rules);
      
      // Estrutura mais compatível com o DTO C#
      const orgData = {
        Name: data.name,                    // PascalCase como no C#
        Description: data.description,
        Image: data.image || null,
        Rules: {
          LoanDurationDays: Number(data.rules.loanDurationDays) || 30,
          MeetingFrequency: convertMeetingFrequencyToInt(data.rules.meetingFrequency),
          MeetingDay: convertMeetingDayToInt(data.rules.meetingDay),
          MeetingWeek: data.rules.meetingWeek ? Number(data.rules.meetingWeek) : null,
          MeetingTime: data.rules.meetingTime || null,
          HasNextWeekMeeting: Boolean(data.rules.nextWeekMeeting) || false,
          RequireCompleteUserInfo: Boolean(data.rules.requireCompleteUserInfo) || false,
        },
        NextMeetingDate: nextMeetingDate ? nextMeetingDate.toISOString() : null,
        CreatedBy: creatorId,
        UpdatedBy: creatorId,
      };
      
      console.log('📤 Dados que serão enviados:', JSON.stringify(orgData, null, 2));
      console.log('🔄 Conversões de enum:');
      console.log('  - MeetingFrequency:', data.rules.meetingFrequency, '->', orgData.Rules.MeetingFrequency);
      console.log('  - MeetingDay:', data.rules.meetingDay, '->', orgData.Rules.MeetingDay);
      console.log('📅 Próxima reunião calculada:', nextMeetingDate ? nextMeetingDate.toLocaleDateString('pt-BR') : 'Nenhuma');
      console.log('📅 NextMeetingDate (ISO):', orgData.NextMeetingDate);

      const newOrganization = await organizationService.createOrganization(orgData);
      
      console.log('📥 Organização criada:', newOrganization);
      
      // Atualizar lista local
      setOrganizations(prev => [...prev, newOrganization]);
      
      Alert.alert('Sucesso', 'Organização criada com sucesso!');
      return newOrganization;
    } catch (error) {
      console.error('❌ Erro ao criar organização na API:', error);
      
      let errorMessage = 'Falha ao criar organização. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Erro interno do servidor.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      Alert.alert('Erro', errorMessage);
      return null;
    }
  }, []);

  const updateOrganization = useCallback(async (orgId: number, updates: Partial<ExtendedOrganization>) => {
    try {
      console.log('🏢 Atualizando organização na API...');
      
      const updatedOrganization = await organizationService.updateOrganization({
        organizationId: orgId,
        ...updates,
      });
      
      console.log('📥 Organização atualizada:', updatedOrganization);
      
      // Atualizar lista local
      setOrganizations(prev => prev.map(org => 
        org.id === orgId ? updatedOrganization : org
      ));
      
      Alert.alert('Sucesso', 'Organização atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar organização na API:', error);
      Alert.alert('Erro', 'Falha ao atualizar organização. Tente novamente.');
    }
  }, []);

  const deleteOrganization = useCallback(async (orgId: number) => {
    try {
      console.log('🏢 Excluindo organização na API...');
      
      await organizationService.deleteOrganization(orgId);
      
      console.log('✅ Organização excluída com sucesso');
      
      // Atualizar lista local
      setOrganizations(prev => prev.filter(org => org.id !== orgId));
      
      Alert.alert('Sucesso', 'Organização excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao excluir organização na API:', error);
      Alert.alert('Erro', 'Falha ao excluir organização. Tente novamente.');
    }
  }, []);

  const getOrganizationStats = useCallback(() => {
    const totalBooks = organizations.reduce((sum, org) => sum + (org.stats?.totalBooks || 0), 0);
    const totalMembers = organizations.reduce((sum, org) => sum + (org.stats?.totalMembers || org.memberCount || 0), 0);
    const activeLoans = organizations.reduce((sum, org) => sum + (org.stats?.activeLoans || 0), 0);
    const monthlyLoans = organizations.reduce((sum, org) => sum + (org.stats?.monthlyLoans || 0), 0);

    return {
      totalBooks,
      totalMembers,
      activeLoans,
      monthlyLoans,
      totalOrganizations: organizations.length,
    };
  }, [organizations]);

  const getOrganizationById = useCallback((orgId: number) => {
    return organizations.find(org => org.id === orgId) || null;
  }, [organizations]);

  const getOrganizationsByUser = useCallback((userId: number) => {
    // Simular organizações do usuário baseado no ID
    return organizations.filter(org => {
      // Lógica simulada: usuário participa de organizações baseado no seu ID
      const userOrgIds = [1, 2, 3]; // IDs das organizações que o usuário participa
      return userOrgIds.includes(org.id);
    });
  }, [organizations]);

  // Método para calcular a próxima reunião de uma organização
  const getNextMeeting = useCallback((organizationId: number) => {
    const org = organizations.find(o => o.id === organizationId);
    if (!org) return null;
    
    return calculateNextMeeting(org.rules);
  }, [organizations]);

  // Método para formatar a próxima reunião de uma organização
  const getNextMeetingFormatted = useCallback((organizationId: number) => {
    const nextMeeting = getNextMeeting(organizationId);
    return {
      date: nextMeeting,
      formatted: formatNextMeetingDate(nextMeeting),
      detail: formatNextMeetingDetail(nextMeeting),
    };
  }, [getNextMeeting]);

  // Método para obter informações completas da próxima reunião
  const getNextMeetingInfo = useCallback((organizationId: number) => {
    const org = organizations.find(o => o.id === organizationId);
    if (!org) return null;
    
    const nextMeeting = calculateNextMeeting(org.rules);
    const today = new Date();
    
    if (!nextMeeting) {
      return {
        hasMeeting: false,
        message: 'Não há reuniões programadas',
        date: null,
        formatted: 'Não há reuniões programadas',
        detail: '',
        daysUntil: null,
        isToday: false,
        isTomorrow: false,
      };
    }
    
    const diffTime = nextMeeting.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      hasMeeting: true,
      message: formatNextMeetingDate(nextMeeting),
      date: nextMeeting,
      formatted: formatNextMeetingDate(nextMeeting),
      detail: formatNextMeetingDetail(nextMeeting),
      daysUntil: diffDays,
      isToday: diffDays === 0,
      isTomorrow: diffDays === 1,
      time: org.rules.meetingTime || 'Horário não definido',
    };
  }, [organizations]);

  return {
    // State
    organizations,
    selectedOrganization,
    isLoading,
    
    // Setters
    setSelectedOrganization,
    
    // Computed
    organizationStats: getOrganizationStats(),
    
    // Actions
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationById,
    getOrganizationsByUser,
    
    // Meeting calculations
    getNextMeeting,
    getNextMeetingFormatted,
    getNextMeetingInfo,
  };
}; 