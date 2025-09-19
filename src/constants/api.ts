/**
 * Constantes relacionadas à API
 * Centraliza configurações de API e endpoints
 */

// ============================================================================
// CONFIGURAÇÕES DE API
// ============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://localhost:53735/api/v1',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// ============================================================================
// ENDPOINTS DA API
// ============================================================================

export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/AccessControl/Authenticate',
    SIGNUP: '/AccessControl/CreateUser',
    LOGOUT: '/AccessControl/logout',
    ME: '/AccessControl/me',
    PROFILE: '/AccessControl/profile',
  },
  
  // Livros
  BOOKS: {
    BASE: '/books',
    SEARCH: '/books/Search',
    USER: (userId: number) => `/books/User/${userId}`,
    BY_ID: (bookId: number) => `/books/${bookId}`,
    LOAN: (bookId: number) => `/books/${bookId}/loan`,
    RETURN: (bookId: number) => `/books/${bookId}/return`,
  },
  
  // Organizações
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id: number) => `/organizations/${id}`,
    JOIN: (id: number) => `/organizations/${id}/join`,
    LEAVE: (id: number) => `/organizations/${id}/leave`,
  },
  
  // Usuários
  USERS: {
    BASE: '/User',
    BY_ID: (id: number) => `/User/${id}`,
    PROFILE: '/User/profile',
  },
} as const;

// ============================================================================
// CÓDIGOS DE STATUS HTTP
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// CÓDIGOS DE ERRO PERSONALIZADOS
// ============================================================================

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// ============================================================================
// CONFIGURAÇÕES DE PAGINAÇÃO
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE CACHE
// ============================================================================

export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  USER_TTL: 10 * 60 * 1000, // 10 minutos
  BOOKS_TTL: 2 * 60 * 1000, // 2 minutos
  ORGANIZATIONS_TTL: 5 * 60 * 1000, // 5 minutos
} as const;
