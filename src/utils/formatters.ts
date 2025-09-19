/**
 * Utilitários de formatação centralizados
 * Centraliza todas as formatações de dados do app
 */

// ============================================================================
// FORMATAÇÃO DE DATAS
// ============================================================================

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
    } else {
      return formatDate(dateString);
    }
  } catch {
    return 'Data inválida';
  }
};

// ============================================================================
// FORMATAÇÃO DE TEXTO
// ============================================================================

export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
};

// ============================================================================
// FORMATAÇÃO DE NÚMEROS
// ============================================================================

export const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// ============================================================================
// FORMATAÇÃO DE STATUS
// ============================================================================

export const formatBookStatus = (statusId: number): string => {
  const statusMap: Record<number, string> = {
    1: 'Disponível',
    2: 'Emprestado',
    3: 'Reservado',
  };
  return statusMap[statusId] || 'Desconhecido';
};

export const formatLoanStatus = (statusId: number): string => {
  const statusMap: Record<number, string> = {
    1: 'Pendente',
    2: 'Aprovado',
    3: 'Rejeitado',
    4: 'Devolvido',
  };
  return statusMap[statusId] || 'Desconhecido';
};

export const formatGenre = (genreId: number): string => {
  const genreMap: Record<number, string> = {
    1: 'Ação',
    2: 'Aventura',
    3: 'Comédia',
    4: 'Drama',
    5: 'Fantasia',
    6: 'Terror',
    7: 'Mistério',
    8: 'Romance',
    9: 'Ficção Científica',
    10: 'Suspense',
    11: 'Western',
  };
  return genreMap[genreId] || 'Desconhecido';
};

// ============================================================================
// FORMATAÇÃO DE ORGANIZAÇÃO
// ============================================================================

export const formatMeetingFrequency = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    biweekly: 'Quinzenal',
    monthly: 'Mensal',
    na: 'Não há reuniões',
  };
  return frequencyMap[frequency] || 'Desconhecido';
};

export const formatMeetingDay = (day: string): string => {
  const dayMap: Record<string, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };
  return dayMap[day] || 'Desconhecido';
};

// ============================================================================
// FORMATAÇÃO DE TAMANHOS DE ARQUIVO
// ============================================================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ============================================================================
// FORMATAÇÃO DE TELEFONE
// ============================================================================

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata baseado no tamanho
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone; // Retorna original se não conseguir formatar
};

// ============================================================================
// FORMATAÇÃO DE CEP
// ============================================================================

export const formatCEP = (cep: string): string => {
  if (!cep) return '';
  
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
};
