import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { RootState, AppDispatch } from '../store';
import { login, logout, signup } from '../store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Verificar se há um token salvo no SecureStore (apenas mobile)
    const checkStoredAuth = async () => {
      try {
        // No web, o token é gerenciado pelo localStorage automaticamente
        if (Platform.OS === 'web') {
          return;
        }
        
        const token = await SecureStore.getItemAsync('authToken');
        if (token && !isAuthenticated) {
          // Se há token mas não está autenticado, pode tentar recuperar o usuário
          console.log('🔑 Token encontrado no SecureStore, mas usuário não autenticado');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar token armazenado:', error);
      }
    };

    checkStoredAuth();
  }, [isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result && result.user && result.token) {
        await SecureStore.setItemAsync('authToken', result.token);
      }
      return result;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      const result = await dispatch(signup(userData)).unwrap();
      if (result && result.user && result.token) {
        await SecureStore.setItemAsync('authToken', result.token);
      }
      return result;
    } catch (error) {
      console.error('❌ Erro no signup:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar o SecureStore
      try {
        await SecureStore.deleteItemAsync('authToken');
      } catch (deleteError) {
        console.error('❌ Erro ao limpar token:', deleteError);
      }
    }
  };

  return {
    user: user?.user || null,
    loading: isLoading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated,
  };
}; 