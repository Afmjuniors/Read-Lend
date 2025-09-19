/**
 * Tipos consolidados para todas as APIs
 * Centraliza todas as interfaces relacionadas às chamadas de API
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// TIPOS DE AUTENTICAÇÃO
// ============================================================================

export interface User {
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
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthenticatedUser {
  user: User;
  token: string;
}

// ============================================================================
// TIPOS DE LIVROS
// ============================================================================

export interface Book extends BaseEntity {
  bookId: number;
  name: string;
  author: string;
  genre: number;
  description: string;
  url: string;
  image: string;
  bookStatusId: number;
  ownerId: number;
  // Informações estendidas
  visibilitySettings?: {
    isPublic: boolean;
    visibleOrganizations: number[];
    hiddenOrganizations: number[];
  };
  loanInfo?: {
    borrowerId: number;
    borrowerName: string;
    borrowerEmail: string;
    loanDate: string;
    returnDate: string;
    isOverdue: boolean;
  };
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

export interface CreateBookRequest {
  name: string;
  author: string;
  genre: number;
  description?: string;
  url?: string;
  image?: string;
  ownerId: number;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  bookId: number;
}

export interface SearchBookParams {
  query?: string;
  genre?: number;
  status?: number;
  organization?: number;
  page?: number;
  limit?: number;
}

// ============================================================================
// TIPOS DE ORGANIZAÇÕES
// ============================================================================

export interface OrganizationRules {
  loanDurationDays: number;
  meetingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'na';
  meetingDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meetingWeek?: 1 | 2 | 3 | 4;
  meetingTime?: string;
  nextWeekMeeting?: boolean;
  requireCompleteUserInfo?: boolean;
}

export interface Organization extends BaseEntity {
  id: number;
  name: string;
  description?: string;
  image?: string;
  memberCount: number;
  rules: OrganizationRules;
}

export interface ExtendedOrganization extends Organization {
  role: 'Admin' | 'Leader' | 'Member';
  isActive: boolean;
  regulations: string[];
  stats: {
    totalBooks: number;
    activeLoans: number;
    totalMembers: number;
    monthlyLoans: number;
  };
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  image?: string;
  rules: OrganizationRules;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {
  id: number;
}

// ============================================================================
// TIPOS DE EMPRÉSTIMOS
// ============================================================================

export interface Loan extends BaseEntity {
  loanId: number;
  bookId: number;
  borrowerId: number;
  lenderId: number;
  loanDate: string;
  returnDate?: string;
  status: number;
}

export interface CreateLoanRequest {
  bookId: number;
  borrowerId: number;
  lenderId: number;
}

export interface UpdateLoanRequest {
  loanId: number;
  returnDate?: string;
  status?: number;
}

// ============================================================================
// TIPOS DE RESPOSTA DA API (DTOs do Backend)
// ============================================================================

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

export interface OrganizationDTO {
  id: number;
  name: string;
  description?: string;
  image?: string;
  memberCount: number;
  createdAt: string;
  rules: OrganizationRules;
}

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

// ============================================================================
// TIPOS DE FILTROS E BUSCA
// ============================================================================

export interface BookSearchParams {
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

export interface BookPageMessage {
  actualPage: number;
  startIndex: number;
  pageSize: number;
  rowsCount: number;
  totalPages: number;
  order: Record<string, string>;
  filter?: BookSearchParams;
}

export interface BookSearchResponse {
  entities?: Book[];
  data?: Book[];
  actualPage: number;
  pageSize: number;
  rowsCount: number;
  totalPages: number;
}

// ============================================================================
// TIPOS DE UI E CONSTANTES
// ============================================================================

export interface Genre {
  id: number;
  name: string;
}

export interface BookStatus {
  id: number;
  name: string;
  color: string;
}

export interface BookVisibility {
  bookId: number;
  organizationId: number;
  isVisible: boolean;
  createdAt: string;
}
