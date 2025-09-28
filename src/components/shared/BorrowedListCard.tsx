import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { ReviewModal } from './ReviewModal';

interface Loan {
  id: number;
  status: 'BORROWED' | 'LATE' | 'RETURNED';
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  bookId: number;
  book: {
    id: number;
    title: string;
    coverImage?: string;
    author?: {
      name: string;
    };
    category?: {
      name: string;
    };
  };
}

interface ApiLoan {
  id: number;
  status: 'BORROWED' | 'LATE' | 'RETURNED';
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  bookId: number;
  book: {
    id: number;
    title: string;
    coverImage?: string;
  };
}

interface Review {
  id: number;
  userId: number;
  bookId: number;
  star: number;
  comment: string;
  createdAt: string;
}

interface BorrowedListCardProps {
  showTitle?: boolean;
  className?: string;
  layout?: 'compact' | 'full'; // compact for profile tab, full for borrowed list tab
  statusFilter?: 'all' | 'BORROWED' | 'LATE' | 'RETURNED';
  searchQuery?: string;
  onGiveReview?: (bookId: number, bookTitle: string) => void;
  reviews?: Review[];
  currentUserId?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export const BorrowedListCard: React.FC<BorrowedListCardProps> = ({
  showTitle = false,
  className = '',
  layout = 'compact',
  statusFilter = 'all',
  searchQuery = '',
  onGiveReview,
  reviews = [],
  currentUserId,
  onLoadMore,
  hasMore: externalHasMore,
  loadingMore: externalLoadingMore,
}) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Use external props if provided, otherwise use internal state
  const hasMoreData = externalHasMore !== undefined ? externalHasMore : hasMore;
  const isLoadingMore =
    externalLoadingMore !== undefined ? externalLoadingMore : loadingMore;

  // Helper function to check if user has reviewed a book
  const getUserReviewForBook = (bookId: number): Review | null => {
    if (!currentUserId || !reviews.length) return null;
    return (
      reviews.find(
        (review) => review.bookId === bookId && review.userId === currentUserId
      ) || null
    );
  };

  useEffect(() => {
    fetchMyLoans();
  }, []);

  // Filter loans based on status and search query
  useEffect(() => {
    let filtered = loans;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.book.title.toLowerCase().includes(query) ||
          loan.book.author?.name?.toLowerCase().includes(query) ||
          loan.book.category?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredLoans(filtered);
  }, [loans, statusFilter, searchQuery]);

  const fetchMyLoans = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        `https://belibraryformentee-production.up.railway.app/api/me/loans?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const loans = data.data?.loans || [];

      // Fetch full book details for each loan
      const loansWithFullBookDetails = await Promise.all(
        loans.map(async (loan: ApiLoan) => {
          try {
            const bookResponse = await fetch(
              `https://belibraryformentee-production.up.railway.app/api/books/${loan.bookId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const bookData = await bookResponse.json();

            return {
              ...loan,
              book: {
                ...loan.book,
                author: bookData.data?.author,
                category: bookData.data?.category,
              },
            };
          } catch (error) {
            console.error(
              'Error fetching book details for loan:',
              loan.id,
              error
            );
            return loan; // Return original loan if book fetch fails
          }
        })
      );

      if (append) {
        setLoans((prevLoans) => [...prevLoans, ...loansWithFullBookDetails]);
      } else {
        setLoans(loansWithFullBookDetails);
      }

      // Check if there are more pages
      const totalPages = data.data?.pagination?.totalPages || 1;
      setHasMore(page < totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching loans:', error);
      if (!append) {
        setLoans([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    } else {
      fetchMyLoans(currentPage + 1, true);
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        `https://belibraryformentee-production.up.railway.app/api/loans/${loanId}/return`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Book returned successfully!');
        fetchMyLoans(); // Refresh the list
      } else {
        alert(data.message || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return {
          bg: 'rgba(36, 165, 0, 0.05)',
          text: '#24A500',
          label: 'Active',
        };
      case 'LATE':
        return {
          bg: 'rgba(238, 29, 82, 0.05)',
          text: '#EE1D52',
          label: 'Overdue',
        };
      case 'RETURNED':
        return {
          bg: 'rgba(36, 165, 0, 0.05)',
          text: '#24A500',
          label: 'Returned',
        };
      default:
        return {
          bg: 'rgba(36, 165, 0, 0.05)',
          text: '#24A500',
          label: 'Active',
        };
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    if (layout === 'full') {
      return (
        <div className='flex flex-col gap-4 w-full md:w-[1000px]'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='flex flex-col items-start p-4 md:p-5 gap-4 w-full md:w-[1000px] min-h-[298px] md:min-h-[250px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl animate-pulse'
            >
              <div className='flex flex-row justify-between items-start gap-5 w-full'>
                <div className='w-24 md:w-32 h-8 bg-gray-300 rounded'></div>
                <div className='w-24 md:w-32 h-8 bg-gray-300 rounded'></div>
              </div>
              <div className='w-full h-0 border-t border-[#D5D7DA]'></div>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 w-full relative group'>
                <div className='flex flex-row items-start gap-4 flex-1 min-w-0'>
                  <div className='w-[70px] h-[106px] md:w-[92px] md:h-[138px] bg-gray-300 rounded'></div>
                  <div className='flex flex-col gap-1 md:gap-2 flex-1'>
                    <div className='w-16 md:w-20 h-7 bg-gray-300 rounded'></div>
                    <div className='w-full h-6 md:h-8 bg-gray-300 rounded'></div>
                    <div className='w-3/4 h-5 md:h-6 bg-gray-300 rounded'></div>
                    <div className='w-1/2 h-5 md:h-6 bg-gray-300 rounded'></div>
                  </div>
                </div>
                <div className='w-full md:w-[182px] h-10 bg-gray-300 rounded-full flex-shrink-0'></div>
                <div className='absolute top-2 right-2 w-12 md:w-16 h-6 bg-gray-300 rounded-full'></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <Card
        className={`w-[557px] h-[298px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] border-0 rounded-2xl ${className}`}
      >
        <CardContent className='flex flex-col items-center justify-center p-5 w-full h-full'>
          <div className='animate-pulse space-y-4 w-full'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='flex gap-4'>
                <div className='w-12 h-16 bg-gray-300 rounded'></div>
                <div className='flex-1 space-y-2'>
                  <div className='bg-gray-300 h-4 rounded w-3/4'></div>
                  <div className='bg-gray-300 h-3 rounded w-1/2'></div>
                  <div className='bg-gray-300 h-3 rounded w-1/3'></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredLoans.length === 0) {
    if (layout === 'full') {
      const getEmptyMessage = () => {
        if (loans.length === 0) {
          return {
            title: 'No borrowed books yet',
            message: 'Your borrowed books will appear here',
          };
        }

        if (statusFilter !== 'all') {
          const statusLabels = {
            BORROWED: 'Active',
            LATE: 'Overdue',
            RETURNED: 'Returned',
          };
          return {
            title: `No ${statusLabels[statusFilter]} books`,
            message: `No books with ${statusLabels[
              statusFilter
            ].toLowerCase()} status found`,
          };
        }

        if (searchQuery.trim()) {
          return {
            title: 'No books found',
            message: `No books match "${searchQuery}"`,
          };
        }

        return {
          title: 'No borrowed books yet',
          message: 'Your borrowed books will appear here',
        };
      };

      const { title, message } = getEmptyMessage();

      return (
        <div className='flex flex-col items-center justify-center p-8 md:p-20 gap-4 w-full md:w-[1000px] h-[300px] md:h-[400px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'>
          <div className='text-4xl md:text-6xl mb-4'>📚</div>
          <h3
            className='font-bold text-lg md:text-xl leading-7 md:leading-8 tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {title}
          </h3>
          <p
            className='font-medium text-sm md:text-base leading-5 md:leading-6 tracking-[-0.02em] text-gray-500 text-center'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {message}
          </p>
        </div>
      );
    }

    return (
      <Card
        className={`w-[557px] h-[298px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] border-0 rounded-2xl ${className}`}
      >
        <CardContent className='flex flex-col items-center justify-center flex-1 text-center'>
          <div className='text-4xl mb-3'>📚</div>
          <p
            className='text-gray-500 font-medium text-base'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            No borrowed books yet
          </p>
          <p
            className='text-gray-400 text-sm mt-1'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Your borrowed books will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  if (layout === 'full') {
    return (
      <div className='flex flex-col gap-4 w-full md:w-[1000px]'>
        {filteredLoans.map((loan) => {
          const statusInfo = getStatusColor(loan.status);
          const daysRemaining = getDaysRemaining(loan.dueAt);

          return (
            <div
              key={loan.id}
              className='flex flex-col items-start p-4 md:p-5 gap-4 w-full md:w-[1000px] min-h-[298px] md:min-h-[250px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'
            >
              {/* Header with Status and Due Date */}
              <div className='flex flex-row justify-between items-start p-0 gap-5 w-full h-8'>
                {/* Status */}
                <div className='flex flex-row items-center p-0 gap-1 md:gap-3 h-8'>
                  <span
                    className='font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Status
                  </span>
                  <div
                    className='flex flex-row justify-center items-center px-2 py-0.5 gap-2 h-8 rounded'
                    style={{ backgroundColor: statusInfo.bg }}
                  >
                    <span
                      className='font-bold text-xs md:text-sm leading-[20px] md:leading-7 tracking-[-0.02em]'
                      style={{
                        fontFamily: 'Quicksand, sans-serif',
                        color: statusInfo.text,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div className='flex flex-row items-center p-0 gap-1 md:gap-3 h-8'>
                  <span
                    className='font-bold text-xs md:text-base leading-[20px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Due Date
                  </span>
                  <div className='flex flex-row justify-center items-center px-2 py-0.5 gap-2 h-8 bg-[rgba(238,29,82,0.1)] rounded'>
                    <span
                      className='font-bold text-xs md:text-sm leading-[20px] md:leading-7 tracking-[-0.02em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {formatDateLong(loan.dueAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className='w-full h-0 border-t border-[#D5D7DA]'></div>

              {/* Book Details and Action */}
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-0 gap-4 md:gap-8 w-full relative group'>
                {/* Book Info - Clickable */}
                <Link
                  to={`/books/${loan.book.id}`}
                  className='flex flex-row items-start p-0 gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer'
                >
                  {/* Book Cover */}
                  <div className='w-[70px] h-[106px] md:w-[92px] md:h-[138px] flex-shrink-0'>
                    {loan.book.coverImage ? (
                      <img
                        src={loan.book.coverImage}
                        alt={loan.book.title}
                        className='w-full h-full object-cover rounded'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    {/* Fallback placeholder - always present but hidden when image loads successfully */}
                    <div
                      className={`w-full h-full bg-gray-200 rounded flex items-center justify-center ${
                        loan.book.coverImage ? 'hidden' : 'flex'
                      }`}
                    >
                      <span className='text-gray-400 text-xl md:text-2xl'>
                        📚
                      </span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className='flex flex-col items-start p-0 gap-1 md:gap-2 flex-1 min-w-0'>
                    {/* Category Badge */}
                    <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 h-7 border border-[#D5D7DA] rounded-md'>
                      <span
                        className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {loan.book.category?.name || 'Category'}
                      </span>
                    </div>

                    {/* Book Name */}
                    <h3
                      className='w-full font-bold text-base md:text-xl leading-[30px] md:leading-6 tracking-[-0.02em] text-[#0A0D12] line-clamp-2'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                      title={loan.book.title}
                    >
                      {loan.book.title}
                    </h3>

                    {/* Author Name */}
                    <p
                      className='w-full font-medium text-sm md:text-base leading-[28px] md:leading-6 tracking-[-0.03em] text-[#414651]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      by {loan.book.author?.name || 'Unknown Author'}
                    </p>

                    {/* Borrow Date and Duration */}
                    <div className='flex flex-row items-center p-0 gap-2 w-full'>
                      <span
                        className='font-bold text-sm md:text-base leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {formatDate(loan.borrowedAt)}
                      </span>
                      <div className='w-0.5 h-0.5 bg-[#0A0D12] rounded-full'></div>
                      <span
                        className='font-bold text-sm md:text-base leading-[28px] md:leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Duration {Math.abs(daysRemaining)} Days
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Action Button */}
                {(loan.status === 'BORROWED' ||
                  loan.status === 'LATE' ||
                  loan.status === 'RETURNED') && (
                  <button
                    onClick={() => {
                      const userReview = getUserReviewForBook(loan.book.id);
                      if (!userReview && onGiveReview) {
                        onGiveReview(loan.book.id, loan.book.title);
                      }
                    }}
                    disabled={!!getUserReviewForBook(loan.book.id)}
                    className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-full md:w-[182px] h-10 rounded-full transition-colors flex-shrink-0 ${
                      getUserReviewForBook(loan.book.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#1C65DA] hover:bg-[#1557C7]'
                    }`}
                  >
                    <span
                      className='font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {getUserReviewForBook(loan.book.id)
                        ? 'Already Reviewed'
                        : 'Give Review'}
                    </span>
                  </button>
                )}

                {/* Return Button - Appears on hover */}
                {(loan.status === 'BORROWED' || loan.status === 'LATE') && (
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 flex-shrink-0'
                  >
                    Return
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Load More Button - Only show if there's more data */}
        {hasMoreData && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className='flex flex-row justify-center items-center px-6 py-3 gap-2 w-[140px] md:w-[200px] h-8 md:h-12 border border-[#D5D7DA] rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <span
                className='font-bold text-sm md:text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Compact layout (original BorrowedCard behavior)
  return (
    <Card
      className={`w-[557px] h-[298px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] border-0 rounded-2xl ${className}`}
    >
      <CardContent className='flex flex-col p-5 w-full h-full overflow-hidden'>
        {showTitle && (
          <h3
            className='font-bold text-lg leading-8 tracking-[-0.03em] text-[#0A0D12] mb-4'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Borrowed Books
          </h3>
        )}

        {loans.length === 0 ? (
          <div className='flex flex-col items-center justify-center flex-1 text-center'>
            <div className='text-4xl mb-3'>📚</div>
            <p
              className='text-gray-500 font-medium text-base'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              No borrowed books yet
            </p>
            <p
              className='text-gray-400 text-sm mt-1'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Your borrowed books will appear here
            </p>
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto space-y-3'>
            {filteredLoans.map((loan) => (
              <Link
                key={loan.id}
                to={`/books/${loan.book.id}`}
                className='flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
              >
                {/* Book Cover */}
                <div className='w-12 h-16 flex-shrink-0'>
                  {loan.book.coverImage ? (
                    <img
                      src={loan.book.coverImage}
                      alt={loan.book.title}
                      className='w-full h-full object-cover rounded'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 rounded flex items-center justify-center'>
                      <span className='text-gray-400 text-sm'>📚</span>
                    </div>
                  )}
                </div>

                {/* Loan Details */}
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-start mb-1'>
                    <h4
                      className='font-bold text-sm leading-5 tracking-[-0.02em] text-[#0A0D12] truncate flex-1 mr-2'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                      title={loan.book?.title}
                    >
                      {loan.book?.title || 'Unknown Title'}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                        loan.status
                      )}`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <div className='text-xs text-gray-600 space-y-1'>
                    <div>
                      <span className='font-medium'>Due:</span>{' '}
                      {formatDate(loan.dueAt)}
                    </div>
                    <div>
                      <span className='font-medium'>Borrowed:</span>{' '}
                      {formatDate(loan.borrowedAt)}
                    </div>
                  </div>

                  <div className='flex gap-2 mt-2'>
                    {loan.status === 'BORROWED' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReturn(loan.id);
                        }}
                        className='px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors'
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Separate component for the modal to ensure proper z-index
export const BorrowedListCardWithModal: React.FC<BorrowedListCardProps> = (
  props
) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleGiveReview = (bookId: number, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBook) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: selectedBook.id,
            star: rating,
            comment: comment,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Review submitted successfully!');
        // Optionally refresh data or update UI
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return (
    <>
      <BorrowedListCard {...props} onGiveReview={handleGiveReview} />

      {/* Review Modal - Outside Card for proper z-index */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedBook(null);
        }}
        bookTitle={selectedBook?.title || ''}
        onSubmit={handleSubmitReview}
      />
    </>
  );
};
