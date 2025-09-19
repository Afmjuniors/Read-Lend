/**
 * Índice centralizado de todos os tipos
 * Facilita importações e mantém consistência
 */

// Tipos da API (consolidados)
export * from './api';

// UserDTO do backend C#
export interface UserDTO {
  userId: number;
  createdAt?: string;
  birthDay?: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  additionalInfo?: string;
  password?: string;
  image?: string;
  token?: string;
  languageId: number;
  userStatusId?: number;
  organizations?: OrganizationDTO[];
  books?: BookDTO[];
  loans?: LoanDTO[];
}

// OrganizationDTO do backend C#
export interface OrganizationDTO {
  id: number;
  name: string;
  description?: string;
  image?: string;
  memberCount: number;
  createdAt: string;
  rules: OrganizationRules;
}

// BookDTO do backend C#
export interface BookDTO {
  bookId: number;
  name: string;
  author: string;
  genre: number;
  description?: string;
  image?: string;
  url?: string;
  bookStatusId: number;
  ownerId: number;
  createdAt: string;
}

// LoanDTO do backend C#
export interface LoanDTO {
  loanId: number;
  bookId: number;
  borrowerId: number;
  lenderId: number;
  loanDate: string;
  returnDate?: string;
  status: number;
  createdAt: string;
}

// Organization Types
export interface OrganizationRules {
  loanDurationDays: number; // Tempo base de empréstimo em dias
  meetingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'na'; // Frequência de reuniões
  meetingDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'; // Dia da semana
  meetingWeek?: 1 | 2 | 3 | 4; // Semana do mês (para reuniões mensais)
  meetingTime?: string; // Horário da reunião (ex: "19:00")
  nextWeekMeeting?: boolean; // Se a próxima semana terá encontro (para quinzenal)
  requireCompleteUserInfo?: boolean; // Se usuários devem ter informações completas
}

// Tipo para organizações com dados estendidos (usado no MainScreen)
export interface ExtendedOrganization {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  role: 'Admin' | 'Leader' | 'Member';
  isActive: boolean;
  image: string;
  createdAt: string;
  rules: OrganizationRules;
  regulations: string[];
  stats: {
    totalBooks: number;
    activeLoans: number;
    totalMembers: number;
    monthlyLoans: number;
  };
}

export interface Organization {
  organizationId: number;
  name: string;
  description?: string;
  image?: string;
  memberCount: number;
  createdAt: string;
  rules: OrganizationRules;
}

export interface BookVisibility {
  bookId: number;
  organizationId: number;
  isVisible: boolean;
  createdAt: string;
}

// Book Types
export interface Book {
  bookId: number;
  name: string;
  author: string;
  genre: number;
  description: string;
  url: string;
  image: string;
  bookStatusId: number;
  ownerId: number;
  createdAt: string;
  updatedAt?: string;
  // Controle de visibilidade por organização
  visibilitySettings?: {
    isPublic: boolean; // Se true, visível para todas as organizações
    visibleOrganizations: number[]; // IDs das organizações que podem ver o livro
    hiddenOrganizations: number[]; // IDs das organizações que NÃO podem ver o livro
  };
  // Informações de empréstimo
  loanInfo?: {
  borrowerId: number;
    borrowerName: string;
    borrowerEmail: string;
    loanDate: string;
    returnDate: string;
    isOverdue: boolean;
  };
  // Informações do proprietário
  ownerInfo?: {
    name: string;
    email: string;
    image?: string;
    organization?: string;
    organizationRole?: string;
    totalBooks: number;
    booksLent: number;
    booksAvailable: number;
  };
}

// Auth Types (compatibilidade)
export interface AuthData {
  user: import('./api').User;
  token: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  data?: AuthData;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  user: import('./api').User;
  token: string;
}

// Book Search Types
export interface SearchBookParams {
  query?: string;
  genre?: number;
  status?: number;
  organization?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// UI Types
export interface Genre {
  id: number;
  name: string;
}

export interface BookStatus {
  id: number;
  name: string;
  color: string;
}

// Constants
export const GENRES: Genre[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Drama' },
  { id: 5, name: 'Fantasy' },
  { id: 6, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 8, name: 'Romance' },
  { id: 9, name: 'ScienceFiction' },
  { id: 10, name: 'Thriller' },
  { id: 11, name: 'Western' },
];

export const BOOK_STATUSES: BookStatus[] = [
  { id: 1, name: 'Disponível', color: '#4CAF50' },
  { id: 2, name: 'Emprestado', color: '#FF9800' },
  { id: 3, name: 'Reservado', color: '#2196F3' },
];

// Utility Functions
export const getGenreText = (genreId: number): string => {
  const genre = GENRES.find(g => g.id === genreId);
  return genre ? genre.name : 'Desconhecido';
};

export const getStatusText = (statusId: number): string => {
  const status = BOOK_STATUSES.find(s => s.id === statusId);
  return status ? status.name : 'Desconhecido';
};

export const getStatusColor = (statusId: number): string => {
  const status = BOOK_STATUSES.find(s => s.id === statusId);
  return status ? status.color : '#999999';
}; 