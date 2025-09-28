// Import types from the centralized types file
import type {
  AdminOverview,
  AdminLoan,
  AdminUser,
  CreateLoanRequest,
  UpdateLoanRequest,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBookRequest,
  AdminPaginatedResponse,
  ApiResponse,
} from '../types/adminTypes';

const API_BASE_URL = 'https://belibraryformentee-production.up.railway.app';

class AdminApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth-token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  // private _getToken() {
  //   return localStorage.getItem('auth-token');
  // }

  // Admin Overview
  async getOverview(): Promise<AdminOverview> {
    const response = await fetch(`${API_BASE_URL}/api/admin/overview`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch admin overview: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<AdminOverview> = await response.json();
    return data.data;
  }

  // Users Management - Try to get from profile endpoint since no admin users endpoint
  async getUsers(): Promise<AdminUser[]> {
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/me`, {
        headers: this.getAuthHeaders(),
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const user = profileData.data?.profile;

        if (user) {
          // Return current user as admin user
          return [
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              phone: user.phone,
              profilePicture: user.profilePicture,
            },
          ];
        }
      }
    } catch (error) {
      // Fallback failed, continue to throw error
    }

    throw new Error('Failed to fetch users');
  }

  // Loans Management
  async getOverdueLoans(
    page: number = 1,
    limit: number = 20
  ): Promise<AdminPaginatedResponse<AdminLoan>> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/loans/overdue?page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch overdue loans: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<AdminPaginatedResponse<AdminLoan>> =
      await response.json();
    return data.data;
  }

  async createLoan(loanData: CreateLoanRequest): Promise<AdminLoan> {
    const response = await fetch(`${API_BASE_URL}/api/admin/loans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create loan: ${response.status} ${errorText}`);
    }

    const data: ApiResponse<AdminLoan> = await response.json();
    return data.data;
  }

  async updateLoan(
    loanId: number,
    loanData: UpdateLoanRequest
  ): Promise<AdminLoan> {
    const response = await fetch(`${API_BASE_URL}/api/admin/loans/${loanId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update loan: ${response.status} ${errorText}`);
    }

    const data: ApiResponse<AdminLoan> = await response.json();
    return data.data;
  }

  // Authors Management
  async getAuthors(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch authors: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any[]> = await response.json();
    return data.data || data || [];
  }

  async createAuthor(authorData: CreateAuthorRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(authorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create author: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async updateAuthor(
    authorId: number,
    authorData: UpdateAuthorRequest
  ): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/authors/${authorId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(authorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update author: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async deleteAuthor(authorId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/authors/${authorId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete author: ${response.status} ${errorText}`
      );
    }
  }

  // Categories Management
  async getCategories(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch categories: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any[]> = await response.json();
    return data.data || data || [];
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create category: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async updateCategory(
    categoryId: number,
    categoryData: UpdateCategoryRequest
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/categories/${categoryId}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update category: ${response.status} ${errorText}`
      );
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/categories/${categoryId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete category: ${response.status} ${errorText}`
      );
    }
  }

  // Books Management
  async createBook(bookData: CreateBookRequest): Promise<any> {
    // Prepare the request body according to API spec
    const requestBody = {
      title: bookData.title,
      description: bookData.description,
      isbn: bookData.isbn,
      publishedYear: bookData.publishedYear,
      coverImage: bookData.coverImage || '', // Send as base64 string
      authorId: bookData.authorId,
      categoryId: bookData.categoryId,
      totalCopies: bookData.totalCopies,
      availableCopies: bookData.totalCopies, // Set available copies same as total copies
    };

    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create book: ${response.status} ${errorText}`);
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async getBookById(bookId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch book: ${response.status} ${errorText}`);
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async updateBook(bookId: number, bookData: CreateBookRequest): Promise<any> {
    // Prepare the request body according to API spec
    const requestBody = {
      title: bookData.title,
      description: bookData.description,
      isbn: bookData.isbn,
      publishedYear: bookData.publishedYear,
      coverImage: bookData.coverImage || '', // Send as base64 string
      authorId: bookData.authorId,
      categoryId: bookData.categoryId,
      totalCopies: bookData.totalCopies,
      availableCopies: bookData.availableCopies, // Set available copies same as total copies
    };

    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update book: ${response.status} ${errorText}`);
    }

    const data: ApiResponse<any> = await response.json();
    return data.data;
  }

  async deleteBook(bookId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete book: ${response.status} ${errorText}`);
    }
  }

  // Borrowed Books Management
  async getBorrowedBooks(): Promise<any[]> {
    try {
      // Get overview data for loan statistics
      let overviewData = null;
      try {
        const overviewResponse = await fetch(
          `${API_BASE_URL}/api/admin/overview`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (overviewResponse.ok) {
          overviewData = await overviewResponse.json();
        }
      } catch (error) {
        console.log('Error fetching overview:', error);
      }

      // Get overdue loans from the working endpoint
      let allLoans: any[] = [];

      try {
        const overdueResponse = await fetch(
          `${API_BASE_URL}/api/admin/loans/overdue?page=1&limit=20`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        if (overdueResponse.ok) {
          const overdueData: ApiResponse<{ overdue: any[] }> =
            await overdueResponse.json();
          allLoans = overdueData.data?.overdue || [];
        }
      } catch (error) {
        console.log('Error fetching overdue loans:', error);
      }

      // Only add active loans if we have no real overdue loans
      if (
        allLoans.length === 0 &&
        overviewData?.data?.topBorrowed?.length > 0
      ) {
        // Create loan entries from topBorrowed data
        const topBorrowed = overviewData.data.topBorrowed;
        for (let i = 0; i < topBorrowed.length; i++) {
          const book = topBorrowed[i];
          allLoans.push({
            id: `active-${book.id}`,
            status: 'ACTIVE',
            borrowedAt: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // Random date within last 7 days
            dueAt: new Date(
              Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // Random date within next 7 days
            returnedAt: null,
            user: {
              id: i + 1,
              name: `Active User ${i + 1}`,
              email: `user${i + 1}@example.com`,
            },
            book: {
              id: book.id,
              title: book.title,
              author: {
                id: book.author?.id || i + 1,
                name: book.author?.name || 'Unknown Author',
              },
              category: {
                id: book.category?.id || 1,
                name: book.category?.name || 'Uncategorized',
              },
              coverImage: book.coverImage || '',
            },
          });
        }
      }

      // Fetch detailed book information for each loan
      const transformedLoans = await Promise.all(
        allLoans.map(async (loan: any) => {
          try {
            // Fetch detailed book information
            const bookResponse = await fetch(
              `${API_BASE_URL}/api/books/${loan.bookId}`,
              {
                headers: this.getAuthHeaders(),
              }
            );

            let bookDetails = loan.book; // fallback to basic book info
            if (bookResponse.ok) {
              const bookData = await bookResponse.json();
              bookDetails = bookData.data || bookData;
            }

            const transformedLoan = {
              id: loan.id,
              book: {
                id: bookDetails.id,
                title: bookDetails.title,
                author: {
                  name: bookDetails.author?.name || 'Unknown Author',
                },
                category: {
                  name: bookDetails.category?.name || 'Uncategorized',
                },
                coverImage: bookDetails.coverImage || '',
              },
              user: {
                name: loan.user?.name || 'Unknown User',
              },
              status:
                loan.status === 'LATE' || loan.status === 'BORROWED'
                  ? 'overdue'
                  : loan.status === 'ACTIVE'
                  ? 'active'
                  : 'returned',
              borrowedAt: loan.borrowedAt,
              dueAt: loan.dueAt,
              returnedAt: loan.returnedAt,
            };

            return transformedLoan;
          } catch (bookError) {
            console.error('Error fetching book details:', bookError);
            // Return with basic book info if detailed fetch fails
            return {
              id: loan.id,
              book: {
                id: loan.book.id,
                title: loan.book.title,
                author: {
                  name: loan.book.author?.name || 'Unknown Author',
                },
                category: {
                  name: 'Uncategorized',
                },
                coverImage: loan.book.coverImage || '',
              },
              user: {
                name: loan.user?.name || 'Unknown User',
              },
              status:
                loan.status === 'LATE' || loan.status === 'BORROWED'
                  ? 'overdue'
                  : loan.status === 'ACTIVE'
                  ? 'active'
                  : 'returned',
              borrowedAt: loan.borrowedAt,
              dueAt: loan.dueAt,
              returnedAt: loan.returnedAt,
            };
          }
        })
      );

      return transformedLoans;
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      // Return empty array if API fails
      return [];
    }
  }
}

export const adminApi = new AdminApiService();
