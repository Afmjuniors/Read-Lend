import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { bookService } from '../../services';
import { Book, SearchBookParams, CreateBookRequest, UpdateBookRequest } from '../../types/api';

/**
 * Hook de livros refatorado
 * Usa o novo serviço consolidado e mantém estado local otimizado
 */
export const useBooks = (currentUserId?: number) => {
  // Estados principais
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  /**
   * Carrega todos os livros da API
   */
  const loadBooks = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('📚 Carregando livros da API...');
      
      // Carregar todos os livros
      const allBooksResponse = await bookService.getAllBooks(1, 50);
      const books = allBooksResponse.entities || allBooksResponse.data || [];
      setAllBooks(books);
      
      // Carregar meus livros
      const myBooksResponse = await bookService.getUserBooks(currentUserId);
      setMyBooks(myBooksResponse);
      
      console.log('✅ Livros carregados:', { 
        total: books.length, 
        myBooks: myBooksResponse.length 
      });
    } catch (error: any) {
      console.error('❌ Erro ao carregar livros:', error);
      setError(error.message || 'Erro ao carregar livros');
      Alert.alert('Erro', 'Falha ao carregar livros. Tente novamente.');
      
      // Definir arrays vazios em caso de erro
      setAllBooks([]);
      setMyBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  /**
   * Busca livros com filtros
   */
  const searchBooks = useCallback(async (params: SearchBookParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await bookService.searchBooks(params);
      const books = response.entities || response.data || [];
      
      setAllBooks(books);
      console.log('🔍 Busca realizada:', books.length, 'livros encontrados');
    } catch (error: any) {
      console.error('❌ Erro na busca:', error);
      setError(error.message || 'Erro na busca');
      Alert.alert('Erro', 'Falha na busca. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cria um novo livro
   */
  const createBook = useCallback(async (bookData: CreateBookRequest): Promise<Book | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newBook = await bookService.createBook(bookData);
      
      // Atualizar lista de meus livros
      setMyBooks(prev => [newBook, ...prev]);
      
      console.log('✅ Livro criado:', newBook.name);
      return newBook;
    } catch (error: any) {
      console.error('❌ Erro ao criar livro:', error);
      setError(error.message || 'Erro ao criar livro');
      Alert.alert('Erro', 'Falha ao criar livro. Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza um livro existente
   */
  const updateBook = useCallback(async (bookData: UpdateBookRequest): Promise<Book | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedBook = await bookService.updateBook(bookData);
      
      // Atualizar listas
      setAllBooks(prev => prev.map(book => 
        book.bookId === bookData.bookId ? updatedBook : book
      ));
      setMyBooks(prev => prev.map(book => 
        book.bookId === bookData.bookId ? updatedBook : book
      ));
      
      console.log('✅ Livro atualizado:', updatedBook.name);
      return updatedBook;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar livro:', error);
      setError(error.message || 'Erro ao atualizar livro');
      Alert.alert('Erro', 'Falha ao atualizar livro. Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove um livro
   */
  const deleteBook = useCallback(async (bookId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await bookService.deleteBook(bookId);
      
      // Remover das listas
      setAllBooks(prev => prev.filter(book => book.bookId !== bookId));
      setMyBooks(prev => prev.filter(book => book.bookId !== bookId));
      
      console.log('✅ Livro removido:', bookId);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao remover livro:', error);
      setError(error.message || 'Erro ao remover livro');
      Alert.alert('Erro', 'Falha ao remover livro. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Solicita empréstimo de um livro
   */
  const requestLoan = useCallback(async (bookId: number): Promise<boolean> => {
    try {
      await bookService.requestLoan(bookId);
      console.log('✅ Empréstimo solicitado:', bookId);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao solicitar empréstimo:', error);
      Alert.alert('Erro', 'Falha ao solicitar empréstimo. Tente novamente.');
      return false;
    }
  }, []);

  /**
   * Retorna um livro emprestado
   */
  const returnBook = useCallback(async (bookId: number): Promise<boolean> => {
    try {
      await bookService.returnBook(bookId);
      console.log('✅ Livro retornado:', bookId);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao retornar livro:', error);
      Alert.alert('Erro', 'Falha ao retornar livro. Tente novamente.');
      return false;
    }
  }, []);

  /**
   * Livros filtrados baseado nos filtros ativos
   */
  const filteredBooks = useCallback(() => {
    let filtered = allBooks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    if (selectedGenre !== null) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (selectedStatus !== null) {
      filtered = filtered.filter(book => book.bookStatusId === selectedStatus);
    }

    return filtered;
  }, [allBooks, searchQuery, selectedGenre, selectedStatus]);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenre(null);
    setSelectedStatus(null);
  }, []);

  /**
   * Carregar livros quando o usuário mudar
   */
  useEffect(() => {
    if (currentUserId) {
      loadBooks();
    }
  }, [currentUserId, loadBooks]);

  return {
    // Estados
    allBooks,
    myBooks,
    filteredBooks: filteredBooks(),
    isLoading,
    error,
    
    // Filtros
    searchQuery,
    selectedGenre,
    selectedStatus,
    
    // Ações
    loadBooks,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    requestLoan,
    returnBook,
    
    // Controle de filtros
    setSearchQuery,
    setSelectedGenre,
    setSelectedStatus,
    clearFilters,
  };
};
