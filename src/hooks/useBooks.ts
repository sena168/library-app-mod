import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { booksApi, reviewsApi } from '../lib/api';
import type {
  BooksQueryParams,
  BorrowBookRequest,
  CreateReviewRequest,
  Author,
} from '../lib/types';
// import { useAppSelector } from '../store';

export const useBooks = (params?: BooksQueryParams) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.getBooks(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getBook(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useRecommendedBooks = () => {
  return useQuery({
    queryKey: ['books', 'recommended'],
    queryFn: () => booksApi.getRecommendedBooks(),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopRatedBooks = (limit: number = 6) => {
  return useQuery({
    queryKey: ['books', 'top-rated', limit],
    queryFn: () => booksApi.getBooks(),
    select: (response) => {
      const books = response.data.books || [];
      return books
        .filter((book: any) => book.rating > 0)
        .sort((a: any, b: any) => b.rating - a.rating)
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllBooks = (searchQuery?: string, _limit?: number) => {
  return useQuery({
    queryKey: ['books', 'all', searchQuery],
    queryFn: () => booksApi.getBooks(),
    select: (response) => {
      let books = response.data.books || [];

      // Filter by search query if provided
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        books = books.filter(
          (book: any) =>
            book.title.toLowerCase().includes(query) ||
            book.author.name.toLowerCase().includes(query) ||
            book.category.name.toLowerCase().includes(query)
        );
      }

      return books;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularAuthors = (limit: number = 4) => {
  return useQuery({
    queryKey: ['authors', 'popular', limit],
    queryFn: () => booksApi.getBooks(),
    select: (response) => {
      const books = response.data.books || [];

      // Group books by author and count them
      const authorMap = new Map<number, Author & { bookCount: number }>();

      books.forEach((book: any) => {
        const authorId = book.author.id;
        if (authorMap.has(authorId)) {
          authorMap.get(authorId)!.bookCount++;
        } else {
          authorMap.set(authorId, {
            ...book.author,
            bookCount: 1,
          });
        }
      });

      // Convert to array, sort by book count, and limit
      return Array.from(authorMap.values())
        .sort((a, b) => b.bookCount - a.bookCount)
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookDetail = (bookId: string) => {
  return useQuery({
    queryKey: ['book', 'detail', bookId],
    queryFn: () => booksApi.getBook(bookId),
    select: (response) => response.data,
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookReviews = (bookId: string) => {
  return useQuery({
    queryKey: ['reviews', 'book', bookId],
    queryFn: () => reviewsApi.getBookReviews(bookId),
    select: (response) => response.data,
    enabled: !!bookId,
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BorrowBookRequest) => booksApi.borrowBook(data),
    onMutate: async ({ bookId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['book', bookId] });
      await queryClient.cancelQueries({ queryKey: ['books'] });

      // Snapshot previous value
      const previousBook = queryClient.getQueryData(['book', bookId]);

      // Optimistically update book stock
      queryClient.setQueryData(['book', bookId], (old: any) => {
        if (old) {
          return {
            ...old,
            stock: Math.max(0, old.stock - 1),
          };
        }
        return old;
      });

      return { previousBook, bookId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'loans'] });
      toast.success('Book borrowed successfully!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback optimistic update
      if (context?.previousBook) {
        queryClient.setQueryData(
          ['book', context.bookId],
          context.previousBook
        );
      }
      const message = error.response?.data?.message || 'Failed to borrow book';
      toast.error(message);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      ...data
    }: CreateReviewRequest & { bookId: number }) =>
      reviewsApi.createReview(bookId.toString(), data),
    onMutate: async ({ bookId, rating, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['reviews', 'book', bookId],
      });

      // Snapshot previous value
      const previousReviews = queryClient.getQueryData([
        'reviews',
        'book',
        bookId,
      ]);

      // Optimistically add new review
      const user = { id: 1, name: 'User', email: 'user@example.com' }; // Mock user for now
      if (user) {
        queryClient.setQueryData(['reviews', 'book', bookId], (old: any) => {
          if (old) {
            const newReview = {
              id: `temp-${Date.now()}`,
              rating,
              comment,
              user,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return [newReview, ...old];
          }
          return old;
        });
      }

      return { previousReviews, bookId };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'book', response.data.bookId],
      });
      queryClient.invalidateQueries({
        queryKey: ['book', response.data.bookId],
      });
      queryClient.invalidateQueries({ queryKey: ['me', 'reviews'] });
      toast.success('Review added successfully!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback optimistic update
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ['reviews', 'book', context.bookId],
          context.previousReviews
        );
      }
      const message = error.response?.data?.message || 'Failed to add review';
      toast.error(message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'reviews'] });
      toast.success('Review deleted successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete review';
      toast.error(message);
    },
  });
};

// Admin-specific hook to get books with status information
export const useAdminBooksWithStatus = () => {
  return useQuery({
    queryKey: ['admin', 'books', 'with-status'],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');

      // Fetch all books from the books endpoint
      const booksResponse = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/books',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!booksResponse.ok) {
        throw new Error(`Failed to fetch books: ${booksResponse.status}`);
      }

      const booksData = await booksResponse.json();
      const allBooks = booksData.data?.books || booksData.data || [];

      // Also fetch admin overview for additional status information
      try {
        const overviewResponse = await fetch(
          'https://belibraryformentee-production.up.railway.app/api/admin/overview',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (overviewResponse.ok) {
          const overviewData = await overviewResponse.json();
          const topBorrowedBooks = overviewData.data.topBorrowed || [];

          // Merge status information from overview with all books
          return allBooks.map((book: any) => {
            const overviewBook = topBorrowedBooks.find(
              (ob: any) => ob.id === book.id
            );
            return {
              ...book,
              // Use overview data if available, otherwise use book data
              availableCopies:
                overviewBook?.availableCopies ??
                book.availableCopies ??
                book.stock ??
                0,
              totalCopies:
                overviewBook?.totalCopies ??
                book.totalCopies ??
                book.stock ??
                0,
              borrowCount: overviewBook?.borrowCount ?? 0,
            };
          });
        }
      } catch (error) {
        console.warn(
          'Could not fetch admin overview, using basic book data:',
          error
        );
      }

      return allBooks;
    },
    select: (books) => {
      // Add status information to each book
      return books.map((book: any) => ({
        ...book,
        status: determineBookStatus(book.availableCopies, book.totalCopies),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to determine book status
const determineBookStatus = (availableCopies: number, totalCopies: number) => {
  if (availableCopies === 0 && totalCopies > 0) {
    return 'Borrowed';
  } else if (availableCopies === totalCopies && totalCopies > 0) {
    return 'Available';
  } else if (availableCopies > 0 && availableCopies < totalCopies) {
    return 'Returned'; // Partially available means some copies are returned
  } else if (totalCopies === 0) {
    return 'Damage'; // No copies available could indicate damage
  } else {
    return 'Available';
  }
};
