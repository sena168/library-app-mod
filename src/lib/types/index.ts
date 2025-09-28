// Common types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UserProfile extends User {
  statistics: {
    totalBorrowed: number;
    currentlyBorrowed: number;
    totalReviews: number;
    overdueBooksCount: number;
  };
}

// Author types
export interface Author extends BaseEntity {
  name: string;
  bio?: string;
  avatar?: string;
  bookCount?: number;
}

// Category types
export interface Category extends BaseEntity {
  name: string;
  description?: string;
}

// Book types
export interface Book extends BaseEntity {
  title: string;
  description?: string;
  isbn: string;
  publishedYear: number;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  pages?: number;
  authorId: number;
  categoryId: number;
  author: Author;
  category: Category;
}

// BookDetail interface for detailed book information
export interface BookDetail extends Book {
  reviews?: Array<{
    id: number;
    star: number; // Updated to match API response
    comment?: string;
    userId: number;
    bookId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  sortBy?: 'title' | 'publishedYear' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BorrowBookRequest {
  bookId: number;
  days?: number;
}

// Loan types
export interface Loan extends BaseEntity {
  userId: number;
  bookId: number;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  book?: {
    id: number;
    title: string;
    coverImage?: string;
  };
}

// Review types
export interface Review extends BaseEntity {
  star: number; // Updated to match API response
  comment?: string;
  userId: number;
  bookId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  book?: {
    id: number;
    title: string;
  };
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}
