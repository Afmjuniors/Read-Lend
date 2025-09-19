/**
 * Índice centralizado de todos os hooks
 * Facilita importações e mantém consistência
 */

// Hooks de autenticação
export { useAuth } from './auth/useAuth';

// Hooks de livros
export { useBooks } from './books/useBooks';

// Hooks existentes (manter compatibilidade)
export { useAuth as useAuthLegacy } from './useAuth';
export { useBooks as useBooksLegacy } from './useBooks';
export { useOrganizations } from './useOrganizations';
export { useUserDetails } from './useUserDetails';
export { useImagePicker } from './useImagePicker';