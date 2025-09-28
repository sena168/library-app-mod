export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://belibraryformentee-production.up.railway.app';

export const APP_CONFIG = {
  name: 'Library Management System',
  version: '1.0.0',
  defaultPageSize: 12,
  maxSearchLength: 100,
  debounceDelay: 300,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER_DATA: 'user-data',
  THEME: 'theme',
  LANGUAGE: 'language',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  LOANS: '/loans',
  PROFILE: '/profile',
  ADMIN: '/admin',
};

export const LOAN_STATUS = {
  BORROWED: 'BORROWED',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
} as const;

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
