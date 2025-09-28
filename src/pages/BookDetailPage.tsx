import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Share2 } from 'lucide-react';
import { Footer } from '../components/layout/Footer';
import { BookCard } from '../components/shared/BookCard';
import { ReviewCard } from '../components/shared/ReviewCard';
import { ReviewModal } from '../components/shared/ReviewModal';
import { Button } from '../components/ui/Button';
import { useBookDetail, useAllBooks } from '../hooks/useBooks';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import type { BookDetail, Review } from '../lib/types';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [displayLimit, setDisplayLimit] = useState(6);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Get current user ID from localStorage
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const currentUserId = currentUser?.id;

  // Scroll to top when component mounts (for normal navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use the proper API hooks
  const {
    data: book,
    isLoading: loading,
    error,
    refetch,
  } = useBookDetail(id || '');

  // Get related books (same category first, then other categories if no same-category books)
  const { data: allBooks = [] } = useAllBooks();
  let relatedBooks = allBooks.filter(
    (b: BookDetail) => b.id !== book?.id && b.categoryId === book?.categoryId
  );

  // If no same-category books, show books from other categories
  if (relatedBooks.length === 0) {
    relatedBooks = allBooks.filter((b: BookDetail) => b.id !== book?.id);
  }

  relatedBooks = relatedBooks.slice(0, 5);

  const handleBorrow = () => {
    if (!book) return;

    // Check if book has available copies
    if (book.availableCopies === 0) {
      showError(
        'Book Not Available',
        'This book is currently out of stock and cannot be borrowed.'
      );
      return;
    }

    // Prepare book data for checkout page
    const checkoutBook = {
      id: book.id,
      title: book.title,
      coverImage: book.coverImage,
      category: {
        name: book.category.name,
      },
      author: {
        name: book.author.name,
      },
    };

    // Store the book in localStorage for checkout page
    localStorage.setItem('checkout_books', JSON.stringify([checkoutBook]));

    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleLoadMoreReviews = () => {
    setDisplayLimit((prev) => prev + 6);
  };

  const handleEditReview = (review: {
    id: number;
    star: number;
    comment?: string;
    userId: number;
    bookId: number;
    user: { id: number; name: string };
    createdAt: string;
  }) => {
    // Map the API review data to ReviewType for editing
    const reviewToEdit: Review = {
      id: review.id,
      star: review.star, // Use star directly
      comment: review.comment,
      userId: review.userId,
      bookId: review.bookId || book?.id || 0,
      user: {
        ...review.user,
        email: '', // Add required email field
      },
      createdAt: review.createdAt,
      updatedAt: review.createdAt,
    };
    setEditingReview(reviewToEdit);
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = async (
    _reviewId: number,
    newRating: number,
    newComment: string
  ) => {
    try {
      // Validate inputs
      if (!book?.id) {
        throw new Error('Book ID is required');
      }

      if (!newRating || newRating < 1 || newRating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (!newComment || newComment.trim().length === 0) {
        throw new Error('Comment is required');
      }

      const token = localStorage.getItem('auth-token');

      // Use POST /api/reviews for both create and update
      const requestBody = {
        bookId: parseInt(book.id.toString()),
        star: parseInt(newRating.toString()),
        comment: newComment.trim(),
      };

      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // Try direct refetch first
        const refetchResult = await refetch();

        // If direct refetch doesn't work, try cache clearing
        if (!refetchResult.data) {
          queryClient.removeQueries({
            queryKey: ['book', 'detail', book.id],
          });

          await queryClient.invalidateQueries({
            queryKey: ['book'],
          });

          await queryClient.refetchQueries({
            queryKey: ['book', 'detail', book.id],
          });
        }

        showSuccess(
          'Review Updated',
          'Your review has been updated successfully!'
        );
        // Close the modal
        setIsEditModalOpen(false);
        setEditingReview(null);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      showError('Update Failed', 'Failed to update review. Please try again.');
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('auth-token');

      const response = await fetch(
        `https://belibraryformentee-production.up.railway.app/api/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove the query from cache completely to force fresh fetch
        queryClient.removeQueries({
          queryKey: ['book', 'detail', book?.id],
        });

        // Invalidate all book-related queries
        await queryClient.invalidateQueries({
          queryKey: ['book'],
        });

        // Refetch the specific book detail
        await queryClient.refetchQueries({
          queryKey: ['book', 'detail', book?.id],
        });

        showSuccess(
          'Review Deleted',
          'Your review has been deleted successfully!'
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Delete Failed', 'Failed to delete review. Please try again.');
      throw error;
    }
  };

  const handleShare = async () => {
    if (!book) return;

    const shareData = {
      title: `${book.title} by ${book.author.name}`,
      text: `Check out this book: ${book.title} by ${
        book.author.name
      }. ${book.description?.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Book details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Book URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const handleAddToCart = () => {
    if (book) {
      // Convert BookDetail to Book type for cart
      const bookForCart = {
        id: book.id,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        coverImage: book.coverImage,
        rating: book.rating,
        reviewCount: book.reviewCount,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        borrowCount: book.borrowCount,
        authorId: book.authorId,
        categoryId: book.categoryId,
        author: book.author,
        category: book.category,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      };

      dispatch(addToCart(bookForCart));
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='animate-pulse'>
            <div className='bg-gray-300 h-8 rounded w-1/4 mb-8'></div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-1'>
                <div className='bg-gray-300 h-96 rounded'></div>
              </div>
              <div className='lg:col-span-2 space-y-4'>
                <div className='bg-gray-300 h-8 rounded'></div>
                <div className='bg-gray-300 h-6 rounded w-2/3'></div>
                <div className='bg-gray-300 h-20 rounded'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !book)) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            Book Not Found
          </h1>
          <p className='text-gray-600 mb-4'>
            {error
              ? 'Failed to load book details.'
              : 'This book does not exist.'}
          </p>
          <Link to='/books'>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              Back to Books
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return null; // Still loading
  }

  return (
    <div className='w-full overflow-x-hidden'>
      {/* Main Container - Figma: 1200px width */}
      <div className='flex flex-col items-end p-4 md:p-0 gap-6 md:gap-16 w-full max-w-[364px] md:max-w-[1200px] mx-auto pt-6 md:pt-8 pb-20 md:pb-0'>
        {/* Main Content Section */}
        <div className='flex flex-col items-start p-0 gap-6 w-full h-auto'>
          {/* Breadcrumb Navigation */}
          <nav
            className='flex items-center p-0 gap-1 w-full max-w-[314px] md:w-full md:max-w-none h-7'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <Link
              to='/'
              className='w-auto h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0'
            >
              Home
            </Link>
            <ChevronRight className='w-4 h-4 text-[#0A0D12] flex-shrink-0' />
            <Link
              to='/category'
              className='w-auto h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-[#1C65DA] hover:underline flex-shrink-0'
            >
              Category
            </Link>
            <ChevronRight className='w-4 h-4 text-[#0A0D12] flex-shrink-0' />
            <span className='w-auto h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] flex-1 min-w-0 truncate'>
              {book?.title}
            </span>
          </nav>

          {/* Book Details Layout */}
          <div className='flex flex-col lg:flex-row items-center p-0 gap-9 lg:gap-9 w-full h-auto'>
            {/* Book Cover Image */}
            <div className='flex items-center p-[5.28514px] gap-[5.29px] w-[222.75px] md:w-full md:max-w-[337px] lg:w-[337px] h-[328.83px] md:h-auto lg:h-[498px] bg-[#E9EAEB] rounded-none'>
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className='w-[212.18px] md:w-full md:max-w-[321px] h-[318.26px] md:h-auto lg:h-[482px] object-contain rounded-none'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = document.getElementById(
                      'book-placeholder'
                    ) as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                      placeholder.classList.remove('hidden');
                      placeholder.classList.add('flex');
                    }
                  }}
                />
              ) : null}
              {/* Fallback placeholder - always present but hidden when image loads successfully */}
              <div
                className={`w-[212.18px] md:w-full md:max-w-[321px] h-[318.26px] md:h-[300px] lg:h-[482px] bg-gray-200 rounded-none flex items-center justify-center ${
                  book.coverImage ? 'hidden' : 'flex'
                }`}
                id='book-placeholder'
              >
                <span className='text-gray-500 text-4xl'>📚</span>
              </div>
            </div>

            {/* Book Information */}
            <div className='flex flex-col items-start p-0 gap-4 md:gap-5 w-full lg:w-[827px] h-auto'>
              {/* Book Header Info */}
              <div className='flex flex-col items-start p-0 gap-3 md:gap-[22px] w-full h-auto'>
                {/* Title Section */}
                <div className='flex flex-col items-start p-0 gap-2 md:gap-1 w-full h-auto'>
                  {/* Category Badge */}
                  <div className='flex justify-center items-center py-0 px-2 gap-2 w-[158px] h-7 border border-[#D5D7DA] rounded-md'>
                    <span
                      className='w-[142px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.category.name}
                    </span>
                  </div>

                  {/* Book Title */}
                  <h1
                    className='w-full font-bold text-2xl md:text-[28px] leading-9 md:leading-[38px] tracking-[-0.02em] text-[#0A0D12] break-words'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                    title={book.title}
                  >
                    {book.title}
                  </h1>

                  {/* Author Name */}
                  <p
                    className='w-full font-semibold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#414651] break-words'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                    title={`by ${book.author.name}`}
                  >
                    {book.author.name}
                  </p>

                  {/* Rating */}
                  {book.rating > 0 && (
                    <div className='flex items-center p-0 gap-0.5 w-[192px] h-[30px]'>
                      <img
                        src='/logos/star-icon.svg'
                        alt='star rating'
                        className='w-6 h-6'
                      />
                      <span
                        className='w-[22px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#181D27]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Statistics Section */}
                <div className='flex flex-row items-center p-0 gap-5 w-full h-[60px] md:h-[66px]'>
                  {/* Pages */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] md:h-[66px]'>
                    <span
                      className='w-[94.67px] h-8 md:h-9 font-bold text-lg md:text-2xl leading-8 md:leading-9 text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      320
                    </span>
                    <span
                      className='w-[94.67px] h-7 md:h-[30px] font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Page
                    </span>
                  </div>

                  {/* Divider */}
                  <div className='w-0 h-[60px] md:h-[66px] border-1 border-[#D5D7DA]'></div>

                  {/* Rating Count */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] md:h-[66px]'>
                    <span
                      className='w-[94.67px] h-8 md:h-9 font-bold text-lg md:text-2xl leading-8 md:leading-9 text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span
                      className='w-[94.67px] h-7 md:h-[30px] font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Rating
                    </span>
                  </div>

                  {/* Divider */}
                  <div className='w-0 h-[60px] md:h-[66px] border-1 border-[#D5D7DA]'></div>

                  {/* Reviews Count */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] md:h-[66px]'>
                    <span
                      className='w-[94.67px] h-8 md:h-9 font-bold text-lg md:text-2xl leading-8 md:leading-9 text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.reviewCount || 0}
                    </span>
                    <span
                      className='w-[94.67px] h-7 md:h-[30px] font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className='w-full max-w-[559px] h-0 border border-[#D5D7DA]'></div>

              {/* Description Section */}
              <div className='flex flex-col items-start p-0 gap-1 w-full h-auto'>
                <h2
                  className='w-full h-9 md:h-[34px] font-bold text-xl md:text-xl leading-9 md:leading-[34px] tracking-[-0.02em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Description
                </h2>
                <p
                  className='w-full font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {book.description ||
                    'The Psychology of Money explores how emotions, biases, and human behavior shape the way we think about money, investing, and financial decisions. Morgan Housel shares timeless lessons on wealth, greed, and happiness, showing that financial success is not about knowledge, but about behavior.'}
                </p>
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className='hidden md:flex flex-col sm:flex-row items-start p-0 gap-3 w-full max-w-[468px] h-auto sm:h-12'>
                {/* Add to Cart Button */}
                <Button
                  variant='figma-outline'
                  onClick={handleAddToCart}
                  className='w-full sm:w-[200px] h-12 !rounded-full'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Add to Cart
                </Button>

                {/* Borrow Book Button */}
                <Button
                  variant='figma-primary'
                  onClick={handleBorrow}
                  disabled={book.availableCopies === 0}
                  className='w-[200px] h-12 !rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {book.availableCopies === 0 ? 'Out of Stock' : 'Borrow Book'}
                </Button>

                {/* Share Button */}
                <Button
                  variant='figma-outline'
                  onClick={handleShare}
                  className='w-11 h-11 p-0 !rounded-full flex items-center justify-center'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  <Share2 className='w-5 h-5 text-[#0A0D12] flex-shrink-0' />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className='w-full h-0 border border-[#D5D7DA]'></div>

        {/* Reviews Section - Figma Frame 106 */}
        <div className='flex flex-col justify-center items-center p-0 gap-[18px] w-full max-w-[361px] md:max-w-[1200px] h-auto overflow-x-hidden'>
          {/* Reviews Header - Figma Frame 75 */}
          <div className='flex flex-col items-start p-0 gap-1 md:gap-3 w-full max-w-[361px] md:max-w-[1200px] h-[70px] md:h-[90px]'>
            {/* Reviews Title */}
            <h2
              className='w-full h-9 md:h-11 font-bold text-2xl md:text-[36px] leading-9 md:leading-11 text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Reviews
            </h2>

            {/* Rating Header - Figma Frame 74 */}
            <div className='flex flex-row items-center p-0 gap-1 w-full max-w-[361px] md:max-w-[1200px] h-[30px] md:h-[34px]'>
              <img
                src='/logos/star-icon.svg'
                alt='star rating'
                className='w-6 h-6 md:w-[34px] md:h-[34px]'
              />
              <span
                className='font-bold text-base md:text-xl leading-[30px] md:leading-[34px] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {book?.rating?.toFixed(1) || '0.0'}
              </span>
              <span
                className='font-bold text-base md:text-xl leading-[30px] md:leading-[34px] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                ({book?.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Reviews Content */}
          {book?.reviews && book.reviews.length > 0 ? (
            <div className='flex flex-col gap-5 w-full max-w-[361px] md:max-w-[1200px]'>
              {/* Review Cards Grid - Multiple Rows */}
              {Array.from({
                length: Math.ceil(
                  Math.min(book.reviews?.length || 0, displayLimit) / 2
                ),
              }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className='flex flex-col md:flex-row items-start p-0 gap-5 w-full md:w-full md:max-w-[590px] h-auto'
                >
                  {/* First Review Card */}
                  {book.reviews?.[rowIndex * 2] && (
                    <ReviewCard
                      review={book.reviews[rowIndex * 2]} // Use API data directly
                      currentUserId={currentUserId}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  )}

                  {/* Second Review Card */}
                  {book.reviews?.[rowIndex * 2 + 1] && (
                    <ReviewCard
                      review={book.reviews[rowIndex * 2 + 1]} // Use API data directly
                      currentUserId={currentUserId}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {book.reviews.length > 0 && (
                <div className='flex justify-center w-full mt-4'>
                  <Button
                    variant='figma-outline'
                    onClick={handleLoadMoreReviews}
                    className='w-[140px] h-8 md:w-[200px] md:h-12 !rounded-full !font-bold text-sm md:text-base'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* No Reviews State */
            <div className='flex flex-col items-center justify-center p-8 w-full max-w-[1200px] h-[300px]'>
              <div className='text-6xl mb-4'>💭</div>
              <h3
                className='font-bold text-xl mb-2 text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                No reviews yet
              </h3>
              <p
                className='font-medium text-base text-[#414651] text-center'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Be the first to review this book and share your thoughts with
                other readers.
              </p>
            </div>
          )}
        </div>

        {/* Divider Line */}
        <div className='w-full h-0 border border-[#D5D7DA]'></div>

        {/* Related Books Section */}
        <div className='flex flex-col items-start p-0 gap-5 md:gap-10 w-full max-w-[336px] md:max-w-[1200px] h-auto mb-16'>
          <h2
            className='w-full h-9 md:h-11 font-bold text-2xl md:text-4xl leading-9 md:leading-11 tracking-[-0.02em] text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Related Books
          </h2>

          <div className='flex flex-wrap items-center content-start p-0 gap-3 md:gap-5 w-full h-auto'>
            {relatedBooks.length > 0 ? (
              relatedBooks.map((relatedBook) => (
                <BookCard
                  key={relatedBook.id}
                  book={relatedBook}
                  size='mobile-recommendation'
                  className='book-card overflow-hidden group flex-shrink-0'
                />
              ))
            ) : (
              <div className='text-center py-8 w-full'>
                <p className='text-gray-500'>No related books found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        bookTitle={book?.title || ''}
        editingReview={
          editingReview
            ? {
                id: editingReview.id,
                star: editingReview.star,
                comment: editingReview.comment,
                userId: editingReview.userId,
                bookId: editingReview.bookId,
                user: editingReview.user,
                createdAt: editingReview.createdAt,
                updatedAt: editingReview.updatedAt,
              }
            : null
        }
        onUpdate={handleUpdateReview}
        onSubmit={() => {}} // Not used in edit mode
      />

      {/* Mobile Bottom Action Buttons - Figma Frame 97 */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
        <div className='flex flex-row items-start p-4 gap-3 w-full max-w-[393px] h-[72px] mx-auto bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
          {/* Add to Cart Button */}
          <Button
            variant='figma-outline'
            onClick={handleAddToCart}
            className='flex-1 h-10 !rounded-full text-sm font-semibold'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Add to Cart
          </Button>

          {/* Borrow Book Button */}
          <Button
            variant='figma-primary'
            onClick={handleBorrow}
            disabled={book?.availableCopies === 0}
            className='flex-1 h-10 !rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {book?.availableCopies === 0 ? 'Out of Stock' : 'Borrow Book'}
          </Button>

          {/* Share Button */}
          <Button
            variant='figma-outline'
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: book?.title,
                  text: `Check out this book: ${book?.title}`,
                  url: window.location.href,
                });
              } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                showSuccess('Link Copied', 'Book link copied to clipboard!');
              }
            }}
            className='w-12 h-12 !rounded-full p-2'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <Share2 className='w-7 h-7' />
          </Button>
        </div>
      </div>
    </div>
  );
};
