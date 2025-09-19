/**
 * Índice centralizado de todos os serviços
 * Facilita importações e mantém consistência
 */

// Serviços base
export { apiClient } from './base/ApiClient';

// Serviços específicos
export { authService } from './auth/AuthService';
export { bookService } from './books/BookService';
export { organizationService } from './organizations/OrganizationService';
export { userService } from './users/UserService';

// Re-exportar tipos para conveniência
export type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  AuthenticatedUser,
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  SearchBookParams,
  Organization,
  ExtendedOrganization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  UserDTO,
  BookDTO,
  OrganizationDTO,
  LoanDTO,
  ApiResponse,
  PaginatedResponse,
} from '../types/api';