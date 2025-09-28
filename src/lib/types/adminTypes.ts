// Admin-related TypeScript interfaces

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
  profilePicture?: string;
}

export interface AdminOverview {
  totals: {
    users: number;
    books: number;
  };
  loans: {
    active: number;
    overdue: number;
  };
  topBorrowed: Array<{
    id: number;
    title: string;
    borrowCount: number;
    rating: number;
    availableCopies: number;
    totalCopies: number;
    author: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
  }>;
}

export interface AdminLoan {
  id: number;
  userId: number;
  bookId: number;
  dueAt: string;
  status: 'BORROWED' | 'RETURNED' | 'LATE';
  createdAt: string;
  updatedAt: string;
  user: {
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

export interface CreateLoanRequest {
  userId: number;
  bookId: number;
  dueAt: string;
}

export interface UpdateLoanRequest {
  dueAt?: string;
  status?: 'BORROWED' | 'RETURNED' | 'LATE';
}

export interface CreateAuthorRequest {
  name: string;
  bio: string;
}

export interface UpdateAuthorRequest {
  name: string;
  bio: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface CreateBookRequest {
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  pages: number;
  authorId: number;
  categoryId: number;
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
}

export interface AdminPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
