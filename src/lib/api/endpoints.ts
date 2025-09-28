import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  Book,
  BookDetail,
  Loan,
  Review,
  UpdateProfileRequest,
  BorrowBookRequest,
  CreateReviewRequest,
} from '../types';

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/api/auth/login', data),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    apiClient.post('/api/auth/register', data),
};

// Books API
export const booksApi = {
  getBooks: (): Promise<{ success: boolean; data: { books: Book[] } }> =>
    apiClient.get('/api/books'),

  getBook: (id: string): Promise<{ success: boolean; data: BookDetail }> =>
    apiClient.get(`/api/books/${id}`),

  getRecommendedBooks: (): Promise<{
    success: boolean;
    data: { books: Book[] };
  }> => apiClient.get('/api/books/recommended'),

  borrowBook: (
    data: BorrowBookRequest
  ): Promise<{ success: boolean; data: Loan }> =>
    apiClient.post('/api/loans', data),
};

// User API
export const userApi = {
  getProfile: (): Promise<{
    success: boolean;
    data: { profile: User; loanStats: any };
  }> => apiClient.get('/api/me'),

  updateProfile: (
    data: UpdateProfileRequest
  ): Promise<{ success: boolean; data: User }> =>
    apiClient.put('/api/me', data),

  getUserLoans: (): Promise<{ success: boolean; data: { loans: Loan[] } }> =>
    apiClient.get('/api/me/loans'),

  getUserReviews: (): Promise<{
    success: boolean;
    data: { reviews: Review[] };
  }> => apiClient.get('/api/me/reviews'),
};

// Loans API
export const loansApi = {
  returnBook: (loanId: string): Promise<{ success: boolean; data: Loan }> =>
    apiClient.put(`/api/loans/${loanId}/return`),
};

// Reviews API
export const reviewsApi = {
  getBookReviews: (
    bookId: string
  ): Promise<{ success: boolean; data: { reviews: Review[] } }> =>
    apiClient.get(`/api/books/${bookId}/reviews`),

  createReview: (
    bookId: string,
    data: CreateReviewRequest
  ): Promise<{ success: boolean; data: Review }> =>
    apiClient.post(`/api/books/${bookId}/reviews`, data),

  deleteReview: (
    reviewId: string
  ): Promise<{ success: boolean; data: Review }> =>
    apiClient.delete(`/api/reviews/${reviewId}`),
};

// Legacy export for backward compatibility
export const api = {
  login: authApi.login,
  register: authApi.register,
};
