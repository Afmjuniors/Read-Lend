import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { UserDTO, OrganizationDTO, BookDTO, LoanDTO } from '../types';
import { userService } from '../services/userService';

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar detalhes do usuário atual
  const loadUserDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('👤 Carregando detalhes do usuário...');
      
      const details = await userService.getUserDetails();
      console.log('📥 Detalhes carregados:', details);
      
      setUserDetails(details);
    } catch (error: any) {
      console.error('❌ Erro ao carregar detalhes do usuário:', error);
      setError(error.message || 'Erro ao carregar detalhes do usuário');
      Alert.alert('Erro', 'Falha ao carregar detalhes do usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar detalhes de um usuário específico
  const loadUserDetailsById = useCallback(async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`👤 Carregando detalhes do usuário ${userId}...`);
      
      const details = await userService.getUserDetailsById(userId);
      console.log('📥 Detalhes carregados:', details);
      
      setUserDetails(details);
    } catch (error: any) {
      console.error('❌ Erro ao carregar detalhes do usuário:', error);
      setError(error.message || 'Erro ao carregar detalhes do usuário');
      Alert.alert('Erro', 'Falha ao carregar detalhes do usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Converter UserDTO para User (formato antigo)
  const convertToUser = useCallback((userDTO: UserDTO) => {
    return {
      userId: userDTO.userId,
      name: userDTO.name,
      email: userDTO.email,
      phone: userDTO.phone,
      address: userDTO.address,
      additionalInfo: userDTO.additionalInfo,
      image: userDTO.image,
      birthDay: userDTO.birthDay,
      createdAt: userDTO.createdAt,
      cultureInfo: 'pt-BR', // Default
    };
  }, []);

  // Converter OrganizationDTO para ExtendedOrganization
  const convertToExtendedOrganization = useCallback((orgDTO: OrganizationDTO) => {
    return {
      id: orgDTO.id,
      name: orgDTO.name,
      description: orgDTO.description || '',
      memberCount: orgDTO.memberCount,
      role: 'Member' as const, // Default role
      isActive: true, // Default
      image: orgDTO.image || '',
      createdAt: orgDTO.createdAt,
      rules: orgDTO.rules,
      regulations: [], // Default
      stats: {
        totalBooks: 0, // Default
        activeLoans: 0, // Default
        totalMembers: orgDTO.memberCount,
        monthlyLoans: 0, // Default
      },
    };
  }, []);

  // Converter BookDTO para Book
  const convertToBook = useCallback((bookDTO: BookDTO) => {
    return {
      bookId: bookDTO.bookId,
      name: bookDTO.name,
      author: bookDTO.author,
      genre: bookDTO.genre,
      description: bookDTO.description || '',
      image: bookDTO.image || '',
      url: bookDTO.url || '',
      bookStatusId: bookDTO.bookStatusId,
      ownerId: bookDTO.ownerId,
      createdAt: bookDTO.createdAt,
    };
  }, []);

  // Getters para dados específicos
  const getUser = useCallback(() => {
    return userDetails ? convertToUser(userDetails) : null;
  }, [userDetails, convertToUser]);

  const getOrganizations = useCallback(() => {
    return userDetails?.organizations?.map(convertToExtendedOrganization) || [];
  }, [userDetails, convertToExtendedOrganization]);

  const getBooks = useCallback(() => {
    return userDetails?.books?.map(convertToBook) || [];
  }, [userDetails, convertToBook]);

  const getLoans = useCallback(() => {
    return userDetails?.loans || [];
  }, [userDetails]);

  // Limpar dados
  const clearUserDetails = useCallback(() => {
    setUserDetails(null);
    setError(null);
  }, []);

  return {
    // Estado
    userDetails,
    isLoading,
    error,
    
    // Ações
    loadUserDetails,
    loadUserDetailsById,
    clearUserDetails,
    
    // Dados convertidos
    getUser,
    getOrganizations,
    getBooks,
    getLoans,
  };
};
