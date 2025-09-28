export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long',
      };
    }
    return { isValid: true };
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  isbn: (isbn: string): boolean => {
    // Basic ISBN validation (10 or 13 digits with optional hyphens)
    const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    return isbnRegex.test(cleanIsbn);
  },

  rating: (rating: number): boolean => {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
};
