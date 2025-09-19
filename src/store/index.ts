import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 