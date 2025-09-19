import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookService } from '../../services';
import { Book, SearchBookParams, PaginatedResponse } from '../../types';

interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  searchParams: SearchBookParams | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const initialState: BooksState = {
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  searchParams: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ params, page = 1 }: { params?: SearchBookParams; page?: number }, { rejectWithValue }) => {
    try {
      const response = await bookService.getAllBooks(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchBook = createAsyncThunk(
  'books/fetchBook',
  async (bookId: number, { rejectWithValue }) => {
    try {
      const book = await bookService.getBookById(bookId);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData: Partial<Book>, { rejectWithValue }) => {
    try {
      const book = await bookService.createBook(bookData as any);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, bookData }: { bookId: number; bookData: Partial<Book> }, { rejectWithValue }) => {
    try {
      const book = await bookService.updateBook({ bookId, ...bookData });
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId: number, { rejectWithValue }) => {
    try {
      await bookService.deleteBook(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete book');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchParams: (state, action: PayloadAction<SearchBookParams>) => {
      state.searchParams = action.payload;
    },
    clearSearchParams: (state) => {
      state.searchParams = null;
    },
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    clearBooks: (state) => {
      state.books = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Temporário - ajustar quando a API retornar dados reais
        state.books = Array.isArray(action.payload) ? action.payload : [];
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalCount: Array.isArray(action.payload) ? action.payload.length : 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Book
      .addCase(fetchBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.isLoading = false;
        // Temporário - ajustar quando a API retornar dados reais
        state.selectedBook = null;
        state.error = null;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Book
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        // Temporário - ajustar quando a API retornar dados reais
        state.error = null;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        // Temporário - ajustar quando a API retornar dados reais
        state.error = null;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(book => book.bookId !== action.payload);
        if (state.selectedBook?.bookId === action.payload) {
          state.selectedBook = null;
        }
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setSearchParams, 
  clearSearchParams, 
  setSelectedBook, 
  clearBooks 
} = booksSlice.actions;

export default booksSlice.reducer; 