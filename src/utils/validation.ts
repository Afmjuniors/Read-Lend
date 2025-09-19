/**
 * Utilitários de validação centralizados
 * Centraliza todas as validações do app
 */

// ============================================================================
// VALIDAÇÕES DE EMAIL
// ============================================================================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailError = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email é obrigatório';
  }
  if (!validateEmail(email)) {
    return 'Digite um email válido';
  }
  return null;
};

// ============================================================================
// VALIDAÇÕES DE SENHA
// ============================================================================

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const getPasswordError = (password: string): string | null => {
  if (!password.trim()) {
    return 'Senha é obrigatória';
  }
  if (password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres';
  }
  return null;
};

// ============================================================================
// VALIDAÇÕES DE NOME
// ============================================================================

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const getNameError = (name: string): string | null => {
  if (!name.trim()) {
    return 'Nome é obrigatório';
  }
  if (name.trim().length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres';
  }
  return null;
};

// ============================================================================
// VALIDAÇÕES DE LIVRO
// ============================================================================

export const validateBook = (bookData: {
  name: string;
  author: string;
  genre: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!bookData.name.trim()) {
    errors.push('Nome do livro é obrigatório');
  }

  if (!bookData.author.trim()) {
    errors.push('Autor é obrigatório');
  }

  if (!bookData.genre || bookData.genre <= 0) {
    errors.push('Gênero é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// VALIDAÇÕES DE ORGANIZAÇÃO
// ============================================================================

export const validateOrganization = (orgData: {
  name: string;
  description?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!orgData.name.trim()) {
    errors.push('Nome da organização é obrigatório');
  }

  if (orgData.name.trim().length < 3) {
    errors.push('O nome deve ter pelo menos 3 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// VALIDAÇÕES DE FORMULÁRIO DE LOGIN
// ============================================================================

export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const emailError = getEmailError(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = getPasswordError(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================================
// VALIDAÇÕES DE FORMULÁRIO DE CADASTRO
// ============================================================================

export const validateSignupForm = (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameError = getNameError(formData.name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = getEmailError(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = getPasswordError(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (formData.confirmPassword !== undefined) {
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};