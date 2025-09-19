import { apiClient } from '../base/ApiClient';
import { 
  Book, 
  CreateBookRequest, 
  UpdateBookRequest, 
  SearchBookParams,
  BookSearchResponse,
  BookPageMessage 
} from '../../types/api';

/**
 * Serviço de livros consolidado
 * Centraliza todas as operações relacionadas aos livros
 */
export class BookService {
  private readonly basePath = '/books';

  /**
   * Busca livros com filtros e paginação
   */
  async searchBooks(
    searchParams: SearchBookParams = {}, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<BookSearchResponse> {
    try {
      console.log('📚 Buscando livros...', { searchParams, page, pageSize });

      const bookPageMessage: BookPageMessage = {
        actualPage: page,
        startIndex: (page - 1) * pageSize,
        pageSize,
        rowsCount: 0,
        totalPages: 0,
        order: { name: 'asc' },
        filter: {
          keyWord: searchParams.query,
          organizationId: searchParams.organization,
          author: searchParams.query, // Usar query como author também
          genre: searchParams.genre,
          bookStatus: searchParams.status,
        },
      };

      const response = await apiClient.post<BookSearchResponse>(
        `${this.basePath}/Search`, 
        bookPageMessage
      );

      console.log('✅ Livros encontrados:', response.entities?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar livros:', error);
      throw error;
    }
  }

  /**
   * Obtém todos os livros (busca geral)
   */
  async getAllBooks(page: number = 1, pageSize: number = 20): Promise<BookSearchResponse> {
    return this.searchBooks({}, page, pageSize);
  }

  /**
   * Obtém livros de um usuário específico
   */
  async getUserBooks(userId: number): Promise<Book[]> {
    try {
      console.log('📚 Buscando livros do usuário:', userId);
      
      const response = await apiClient.get<Book[]>(`${this.basePath}/User/${userId}`);
      
      console.log('✅ Livros do usuário encontrados:', response.length);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar livros do usuário:', error);
      throw error;
    }
  }

  /**
   * Obtém um livro específico por ID
   */
  async getBookById(bookId: number): Promise<Book> {
    try {
      console.log('📖 Buscando livro:', bookId);
      
      const response = await apiClient.get<Book>(`${this.basePath}/${bookId}`);
      
      console.log('✅ Livro encontrado:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar livro:', error);
      throw error;
    }
  }

  /**
   * Cria um novo livro
   */
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    try {
      console.log('📝 Criando novo livro...', bookData.name);
      
      const response = await apiClient.post<Book>(this.basePath, bookData);
      
      console.log('✅ Livro criado com sucesso:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar livro:', error);
      throw error;
    }
  }

  /**
   * Atualiza um livro existente
   */
  async updateBook(bookData: UpdateBookRequest): Promise<Book> {
    try {
      console.log('✏️ Atualizando livro:', bookData.bookId);
      
      const response = await apiClient.put<Book>(
        `${this.basePath}/${bookData.bookId}`, 
        bookData
      );
      
      console.log('✅ Livro atualizado com sucesso:', response.name);
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar livro:', error);
      throw error;
    }
  }

  /**
   * Remove um livro
   */
  async deleteBook(bookId: number): Promise<void> {
    try {
      console.log('🗑️ Removendo livro:', bookId);
      
      await apiClient.delete(`${this.basePath}/${bookId}`);
      
      console.log('✅ Livro removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover livro:', error);
      throw error;
    }
  }

  /**
   * Solicita empréstimo de um livro
   */
  async requestLoan(bookId: number): Promise<void> {
    try {
      console.log('📋 Solicitando empréstimo do livro:', bookId);
      
      await apiClient.post(`${this.basePath}/${bookId}/loan`);
      
      console.log('✅ Empréstimo solicitado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao solicitar empréstimo:', error);
      throw error;
    }
  }

  /**
   * Retorna um livro emprestado
   */
  async returnBook(bookId: number): Promise<void> {
    try {
      console.log('📚 Retornando livro:', bookId);
      
      await apiClient.post(`${this.basePath}/${bookId}/return`);
      
      console.log('✅ Livro retornado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao retornar livro:', error);
      throw error;
    }
  }
}

// Instância singleton
export const bookService = new BookService();
