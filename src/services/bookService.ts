import api from '../config/api';
import { Book, SearchBookParams } from '../types';

export interface CreateBookRequest {
  name: string;
  author: string;
  genre: number;
  description: string;
  url?: string;
  image?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  bookId: number;
}

class BookService {
  async getBooks(params?: SearchBookParams): Promise<Book[]> {
    const response = await api.get<Book[]>('/books', { params });
    return response.data;
  }

  async getBookById(bookId: number): Promise<Book> {
    const response = await api.get<Book>(`/books/${bookId}`);
    return response.data;
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await api.post<Book>('/books', bookData);
    return response.data;
  }

  async updateBook(bookData: UpdateBookRequest): Promise<Book> {
    const { bookId, ...data } = bookData;
    const response = await api.put<Book>(`/books/${bookId}`, data);
    return response.data;
  }

  async deleteBook(bookId: number): Promise<void> {
    await api.delete(`/books/${bookId}`);
  }

  async requestLoan(bookId: number): Promise<void> {
    await api.post(`/books/${bookId}/loan`);
  }

  async returnBook(bookId: number): Promise<void> {
    await api.post(`/books/${bookId}/return`);
  }

  async updateBookVisibility(bookId: number, visibilitySettings: Book['visibilitySettings']): Promise<Book> {
    const response = await api.put<Book>(`/books/${bookId}/visibility`, visibilitySettings);
    return response.data;
  }
}

export default new BookService(); 