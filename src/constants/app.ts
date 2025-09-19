/**
 * Constantes gerais da aplicação
 * Centraliza configurações e constantes do app
 */

// ============================================================================
// CHAVES DE ARMAZENAMENTO
// ============================================================================

export const STORAGE_KEYS = {
  USER: 'library_user',
  TOKEN: 'library_token',
  SETTINGS: 'library_settings',
  CACHE: 'library_cache',
} as const;

// ============================================================================
// CONFIGURAÇÕES DE VALIDAÇÃO
// ============================================================================

export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Digite um email válido',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'A senha deve ter pelo menos 6 caracteres',
  },
  NAME: {
    MIN_LENGTH: 2,
    MESSAGE: 'O nome deve ter pelo menos 2 caracteres',
  },
  PHONE: {
    PATTERN: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    MESSAGE: 'Digite um telefone válido',
  },
  CEP: {
    PATTERN: /^\d{5}-\d{3}$/,
    MESSAGE: 'Digite um CEP válido',
  },
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
// CONFIGURAÇÕES DE ANIMAÇÃO
// ============================================================================

export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// ============================================================================
// CONFIGURAÇÕES DE TIMEOUT
// ============================================================================

export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 segundos
  IMAGE_LOAD: 10000, // 10 segundos
  USER_INTERACTION: 5000, // 5 segundos
} as const;

// ============================================================================
// CONFIGURAÇÕES DE LIMITES
// ============================================================================

export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_AUTHOR_LENGTH: 100,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE CACHE (APP)
// ============================================================================

export const APP_CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  USER_TTL: 10 * 60 * 1000, // 10 minutos
  BOOKS_TTL: 2 * 60 * 1000, // 2 minutos
  ORGANIZATIONS_TTL: 5 * 60 * 1000, // 5 minutos
} as const;

// ============================================================================
// CONFIGURAÇÕES DE REGEX
// ============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CEP: /^\d{5}-\d{3}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9-]+$/,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE FORMATAÇÃO
// ============================================================================

export const FORMAT_CONFIG = {
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',
  CURRENCY_LOCALE: 'pt-BR',
  CURRENCY_CODE: 'BRL',
} as const;
