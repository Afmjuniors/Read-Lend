import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { RootState, AppDispatch } from '../../store';
import { login, logout, signup } from '../../store/slices/authSlice';
import { authService } from '../../services';
import { LoginRequest, SignupRequest } from '../../types/api';

/**
 * Hook de autenticação refatorado
 * Usa o novo serviço consolidado e mantém compatibilidade com Redux
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Verificar autenticação persistente apenas no mobile
    const checkStoredAuth = async () => {
      try {
        if (Platform.OS === 'web') {
          return; // No web, o token é gerenciado automaticamente
        }
        
        // Verificar se há token mas usuário não está autenticado
        if (!isAuthenticated) {
          const isAuth = await authService.isAuthenticated();
          if (isAuth) {
            console.log('🔑 Usuário autenticado encontrado');
            // Aqui poderia recuperar dados do usuário se necessário
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
      }
    };

    checkStoredAuth();
  }, [isAuthenticated]);

  /**
   * Realiza login do usuário
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      const credentials: LoginRequest = { email, password };
      const result = await dispatch(login(credentials)).unwrap();
      
      if (result && result.user && result.token) {
        console.log('✅ Login realizado com sucesso');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  /**
   * Registra novo usuário
   */
  const handleSignup = async (userData: SignupRequest) => {
    try {
      const result = await dispatch(signup(userData)).unwrap();
      
      if (result && result.user && result.token) {
        console.log('✅ Cadastro realizado com sucesso');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      throw error;
    }
  };

  /**
   * Realiza logout do usuário
   */
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar o estado local
      throw error;
    }
  };

  return {
    // Estado
    user: user?.user || null,
    loading: isLoading,
    error,
    isAuthenticated,
    
    // Ações
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
