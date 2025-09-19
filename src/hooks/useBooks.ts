import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { Book, User, getGenreText, getStatusText, getStatusColor } from '../types';
import { bookService } from '../services/api';

// Interface para resposta da API de livros
interface BookApiResponse {
  bookId: number;
  createdAt: string;
  name: string;
  author: string;
  genre: number;
  description: string;
  url: string;
  image: string;
  bookStatusId: number;
  ownerId: number;
}

interface UseBooksOptions {
  currentUserId: number;
}

export const useBooks = ({ currentUserId }: UseBooksOptions) => {
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([1]); // Filtro inicial: apenas disponíveis
  const [selectedOrganizations, setSelectedOrganizations] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Carregar livros da API
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true);
        console.log('📚 Carregando livros da API...');
        
        // Carregar todos os livros usando POST /books/Search (página inicial)
        const allBooksResponse = await bookService.getAllBooks(1, 50);
        console.log('📥 Resposta da API (todos os livros):', allBooksResponse);
        // Verificar se a resposta tem a estrutura esperada
        const allBooks = (allBooksResponse as any)?.entities || allBooksResponse?.data || [];
        console.log('📥 Todos os livros carregados:', Array.isArray(allBooks) ? allBooks.length : 'não é array');
        
        // Carregar meus livros usando GET /books/User/{userId} (perfil)
        const myBooksResponse = await bookService.getUserBooks(currentUserId);
        console.log('📥 Resposta da API (meus livros):', myBooksResponse);
        
        // Verificar se a resposta tem a estrutura esperada
        const myBooks = Array.isArray(myBooksResponse) ? myBooksResponse : [];
        console.log('📥 Meus livros carregados:', myBooks.length);
        
        console.log('🔧 Definindo allBooks:', Array.isArray(allBooks) ? allBooks.length : 'não é array', allBooks);
        setAllBooks(allBooks);
        setMyBooks(myBooks);
        
        console.log('✅ Livros carregados com sucesso');
      } catch (error) {
        console.error('❌ Erro ao carregar livros da API:', error);
        Alert.alert('Erro', 'Falha ao carregar livros. Tente novamente.');
        // Definir arrays vazios em caso de erro
        setAllBooks([]);
        setMyBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [currentUserId]);

  // Função para buscar livros com filtros
  const searchBooksWithFilters = useCallback(async (page = 1) => {
    try {
      console.log('🔍 Buscando livros com filtros...');
      
      const searchParams = {
        keyWord: searchQuery.trim() || undefined,
        genre: selectedGenres.length > 0 ? selectedGenres[0] : undefined, // Por enquanto só um gênero
        bookStatus: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined, // Por enquanto só um status
        organizationId: selectedOrganizations.length > 0 ? selectedOrganizations[0] : undefined, // Por enquanto só uma org
      };

      const response = await bookService.searchBooks(searchParams, page, 20);
      console.log('📥 Resposta da busca:', response);
      
      // Verificar se a resposta tem a estrutura esperada
      const books = response?.data || response || [];
      const actualPage = response?.actualPage || page;
      const totalPages = response?.totalPages || 1;
      const rowsCount = response?.rowsCount || books.length;
      
      console.log('🔧 Definindo allBooks na busca:', Array.isArray(books) ? books.length : 'não é array', books);
      if (page === 1) {
        setAllBooks(books);
      } else {
        setAllBooks(prev => {
          if (!Array.isArray(prev)) {
            console.warn('⚠️ prev não é um array em searchBooksWithFilters:', prev);
            return books;
          }
          return [...prev, ...books];
        });
      }
      
      setCurrentPage(actualPage);
      setTotalPages(totalPages);
      setTotalBooks(rowsCount);
      
      console.log('✅ Busca realizada com sucesso');
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      Alert.alert('Erro', 'Falha ao buscar livros. Tente novamente.');
    }
  }, [searchQuery, selectedGenres, selectedStatuses, selectedOrganizations]);

  // Função para recarregar livros do usuário
  const reloadUserBooks = useCallback(async () => {
    try {
      console.log('🔄 Recarregando livros do usuário...');
      const myBooksResponse = await bookService.getUserBooks(currentUserId);
      console.log('📥 Resposta da API (recarregar):', myBooksResponse);
      
      // Verificar se a resposta tem a estrutura esperada
      const myBooks = Array.isArray(myBooksResponse) ? myBooksResponse : [];
      setMyBooks(myBooks);
      console.log('✅ Livros do usuário recarregados:', myBooks.length);
    } catch (error) {
      console.error('❌ Erro ao recarregar livros do usuário:', error);
      setMyBooks([]);
    }
  }, [currentUserId]);

  // Funções de filtro
  const getFilteredBooks = useCallback(() => {
    // Verificar se allBooks é um array
    if (!Array.isArray(allBooks)) {
      console.warn('⚠️ allBooks não é um array:', allBooks);
      return [];
    }
    
    // Filtrar apenas livros que NÃO são meus (livros de outros usuários)
    let filtered = allBooks.filter(book => book.ownerId !== currentUserId);

    // Filtro por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        getGenreText(book.genre).toLowerCase().includes(query)
      );
    }

    // Filtro por gêneros (múltipla seleção)
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(book => selectedGenres.includes(book.genre));
    }

    // Filtro por status (múltipla seleção)
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(book => selectedStatuses.includes(book.bookStatusId));
    }

    // Filtro por organizações (múltipla seleção)
    if (selectedOrganizations.length > 0) {
      filtered = filtered.filter(book => {
        // Simular que alguns livros pertencem a organizações específicas
        const orgId = Math.ceil(book.ownerId / 5);
        return selectedOrganizations.includes(orgId);
      });
    }

    return filtered;
  }, [allBooks, currentUserId, searchQuery, selectedGenres, selectedStatuses, selectedOrganizations]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedStatuses([1]); // Manter apenas disponíveis como padrão
    setSelectedOrganizations([]);
  }, []);

  // Funções para toggle dos filtros
  const toggleGenre = useCallback((genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  }, []);

  const toggleStatus = useCallback((statusId: number) => {
    setSelectedStatuses(prev => 
      prev.includes(statusId) 
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  }, []);

  const toggleOrganization = useCallback((orgId: number) => {
    setSelectedOrganizations(prev => 
      prev.includes(orgId) 
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    );
  }, []);

  // CRUD Operations
  const addBook = useCallback(async (newBook: Omit<Book, 'bookId' | 'createdAt'>, owner: User) => {
    try {
      // Preparar dados para a API
      const bookDataForApi = {
        name: newBook.name,
        author: newBook.author,
        genre: newBook.genre,
        description: newBook.description,
        url: newBook.url,
        image: newBook.image,
        bookStatusId: newBook.bookStatusId,
        ownerId: owner.userId,
        // Adicionar campos específicos da sua API se necessário
        // visibilitySettings: newBook.visibilitySettings,
      };

      console.log('📤 Enviando dados para API:', bookDataForApi);

      // Chamada para a API
      const apiResponse = await bookService.addBook(bookDataForApi) as BookApiResponse;
      
      console.log('📥 Resposta da API:', apiResponse);

      // Criar objeto Book com dados da API
      const book: Book = {
        ...newBook,
        bookId: apiResponse.bookId || Date.now(), // Usar ID da API se disponível
        createdAt: apiResponse.createdAt || new Date().toISOString(),
        ownerId: owner.userId,
        ownerInfo: {
          name: owner.name,
          email: owner.email,
          totalBooks: myBooks.length + 1,
          booksLent: myBooks.filter(b => b.bookStatusId === 2).length,
          booksAvailable: myBooks.filter(b => b.bookStatusId === 1).length + 1,
        },
      };

             // Atualizar estado local
       setAllBooks(prev => {
         if (!Array.isArray(prev)) {
           console.warn('⚠️ prev não é um array em addBook:', prev);
           return [book];
         }
         return [...prev, book];
       });
       
       // Recarregar livros do usuário para garantir sincronização
       await reloadUserBooks();
       
       Alert.alert('Sucesso', 'Livro adicionado com sucesso!');
       return book;
    } catch (error) {
      console.error('❌ Erro ao adicionar livro na API:', error);
      Alert.alert('Erro', 'Falha ao adicionar livro. Tente novamente.');
      throw error;
    }
  }, [myBooks]);

  const updateBook = useCallback((bookId: number, updates: Partial<Book>) => {
    const updatedBook = { ...updates, bookId };
    
    setMyBooks(prev => prev.map(book => 
      book.bookId === bookId ? { ...book, ...updatedBook } : book
    ));
    
    setAllBooks(prev => {
      if (!Array.isArray(prev)) {
        console.warn('⚠️ prev não é um array em updateBook:', prev);
        return [];
      }
      return prev.map(book => 
        book.bookId === bookId ? { ...book, ...updatedBook } : book
      );
    });

    Alert.alert('Sucesso', 'Livro atualizado com sucesso!');
  }, []);

  const deleteBook = useCallback((bookId: number) => {
    setMyBooks(prev => prev.filter(book => book.bookId !== bookId));
    setAllBooks(prev => {
      if (!Array.isArray(prev)) {
        console.warn('⚠️ prev não é um array em deleteBook:', prev);
        return [];
      }
      return prev.filter(book => book.bookId !== bookId);
    });
    Alert.alert('Sucesso', 'Livro excluído com sucesso!');
  }, []);

  const updateBookVisibility = useCallback((bookId: number, visibilitySettings: Book['visibilitySettings']) => {
    setMyBooks(prev => prev.map(book => 
      book.bookId === bookId 
        ? { ...book, visibilitySettings }
        : book
    ));
    
    setAllBooks(prev => {
      if (!Array.isArray(prev)) {
        console.warn('⚠️ prev não é um array em updateBookVisibility:', prev);
        return [];
      }
      return prev.map(book => 
        book.bookId === bookId 
          ? { ...book, visibilitySettings }
          : book
      );
    });
  }, []);

  // Estatísticas
  const getBookStats = useCallback(() => {
    const totalBooks = myBooks.length;
    const availableBooks = myBooks.filter(book => book.bookStatusId === 1).length;
    const lentBooks = myBooks.filter(book => book.bookStatusId === 2).length;
    const reservedBooks = myBooks.filter(book => book.bookStatusId === 3).length;

    return {
      totalBooks,
      availableBooks,
      lentBooks,
      reservedBooks,
    };
  }, [myBooks]);

  return {
    // State
    myBooks,
    allBooks,
    isLoading,
    searchQuery,
    selectedGenres,
    selectedStatuses,
    selectedOrganizations,
    currentPage,
    totalPages,
    totalBooks,
    
    // Setters
    setSearchQuery,
    setSelectedGenres,
    setSelectedStatuses,
    setSelectedOrganizations,
    
    // Computed
    filteredBooks: getFilteredBooks(),
    bookStats: getBookStats(),
    
    // Actions
    addBook,
    updateBook,
    deleteBook,
    updateBookVisibility,
    clearFilters,
    toggleGenre,
    toggleStatus,
    toggleOrganization,
    searchBooksWithFilters,
    reloadUserBooks,
  };
}; 