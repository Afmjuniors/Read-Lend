/**
 * Índice centralizado de todas as constantes
 * Facilita importações e mantém consistência
 */

import { Platform } from 'react-native';

// Constantes da API
export * from './api';

// Constantes do app
export * from './app';

// Cores do tema
export const COLORS = {
  // Cores primárias
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Cores secundárias
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7A79E0',
  
  // Cores de status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Cores neutras
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Cores de fundo
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Cores de texto
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
} as const;

// Espaçamentos
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Tamanhos de fonte
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
} as const;

// Pesos de fonte
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Raios de borda
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
} as const;

// Sombras com suporte para web
export const SHADOWS = {
  small: Platform.OS === 'web' ? {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  } : {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: Platform.OS === 'web' ? {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  } : {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: Platform.OS === 'web' ? {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  } : {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Configurações de animação
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Configurações de validação
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Digite um email válido',
  },
  password: {
    minLength: 6,
    message: 'A senha deve ter pelo menos 6 caracteres',
  },
  name: {
    minLength: 2,
    message: 'O nome deve ter pelo menos 2 caracteres',
  },
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  network: 'Erro de conexão. Verifique sua internet.',
  server: 'Erro no servidor. Tente novamente mais tarde.',
  unknown: 'Erro inesperado. Tente novamente.',
  auth: {
    invalidCredentials: 'Email ou senha incorretos',
    userNotFound: 'Usuário não encontrado',
    accountDisabled: 'Conta desabilitada',
  },
  books: {
    notFound: 'Livro não encontrado',
    alreadyExists: 'Livro já existe',
    invalidData: 'Dados do livro inválidos',
  },
} as const;

// Configurações de paginação
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

// Mapeamento de dias da semana baseado no C# (1=domingo, 2=segunda, etc.)
export const DAY_MAP = {
  'sunday': 1,
  'monday': 2,
  'tuesday': 3,
  'wednesday': 4,
  'thursday': 5,
  'friday': 6,
  'saturday': 7,
} as const; 