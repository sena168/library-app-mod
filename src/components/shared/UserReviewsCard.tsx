import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface UserReview {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book: {
    id: number;
    title: string;
    coverImage: string;
    author: {
      name: string;
    };
    category: {
      name: string;
    };
  };
}

interface UserReviewsCardProps {
  className?: string;
  onEditReview?: (review: UserReview) => void;
  onDeleteReview?: (reviewId: number) => void;
  refreshTrigger?: number; // Add this to trigger refresh from parent
  searchQuery?: string; // Add search query prop from parent
}

export const UserReviewsCard: React.FC<UserReviewsCardProps> = ({
  className = '',
  onEditReview,
  onDeleteReview,
  refreshTrigger,
  searchQuery: externalSearchQuery = '',
}) => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchUserReviews();
    }
  }, [refreshTrigger]);

  // Filter reviews based on search query
  useEffect(() => {
    if (externalSearchQuery.trim()) {
      const query = externalSearchQuery.toLowerCase();
      const filtered = reviews.filter(
        (review) =>
          review.book.title.toLowerCase().includes(query) ||
          review.book.author?.name?.toLowerCase().includes(query) ||
          review.book.category?.name?.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query)
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  }, [reviews, externalSearchQuery]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/me/reviews',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log('User Reviews Response:', data);

      const reviews = data.data?.reviews || [];

      // Fetch full book details for each review
      const reviewsWithFullBookDetails = await Promise.all(
        reviews.map(async (review: UserReview) => {
          try {
            const bookResponse = await fetch(
              `https://belibraryformentee-production.up.railway.app/api/books/${review.book.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const bookData = await bookResponse.json();
            console.log('Book details for review:', review.id, bookData);

            return {
              ...review,
              book: {
                ...review.book,
                author: bookData.data?.author,
                category: bookData.data?.category,
              },
            };
          } catch (error) {
            console.error(
              'Error fetching book details for review:',
              review.id,
              error
            );
            return review; // Return original review if book fetch fails
          }
        })
      );

      console.log(
        'Final reviews with full book details:',
        reviewsWithFullBookDetails
      );
      setReviews(reviewsWithFullBookDetails);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 ${
          index < rating ? 'text-[#FFAB0D] fill-[#FFAB0D]' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className='flex flex-col gap-4 md:gap-6 w-full md:w-[1000px]'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='flex flex-col items-start p-4 md:p-5 gap-4 md:gap-5 w-full md:w-[1000px] h-auto md:h-[380px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl animate-pulse'
          >
            <div className='flex flex-row items-center gap-3 w-[135px] md:w-[155px] h-7 md:h-[30px]'>
              <div className='w-[135px] md:w-[155px] h-7 md:h-[30px] bg-gray-200 rounded'></div>
            </div>
            <div className='w-full h-[1px] bg-gray-200'></div>
            <div className='flex flex-row items-center gap-3 md:gap-4 w-full h-[106px] md:h-[138px]'>
              <div className='w-[70px] md:w-[92px] h-[106px] md:h-[138px] bg-gray-200 rounded'></div>
              <div className='flex flex-col gap-1 w-[196px] h-[94px] md:h-[100px]'>
                <div className='w-[78px] h-7 md:h-[28px] bg-gray-200 rounded'></div>
                <div className='w-[196px] h-[30px] md:h-[34px] bg-gray-200 rounded'></div>
                <div className='w-[196px] h-7 md:h-[30px] bg-gray-200 rounded'></div>
              </div>
            </div>
            <div className='w-full h-[1px] bg-gray-200'></div>
            <div className='flex flex-col gap-2 w-full h-[116px] md:h-[92px]'>
              <div className='flex flex-row gap-0.5 md:gap-1 w-[128px] h-6 md:h-[24px]'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='w-6 h-6 bg-gray-200 rounded'></div>
                ))}
              </div>
              <div className='w-full h-[84px] md:h-[60px] bg-gray-200 rounded'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 md:p-20 gap-4 w-full md:w-[1000px] h-[300px] md:h-[400px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'>
        <div className='text-4xl md:text-6xl mb-4'>⭐</div>
        <h3
          className='font-bold text-lg md:text-xl leading-7 md:leading-8 tracking-[-0.03em] text-[#0A0D12]'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          No reviews yet
        </h3>
        <p
          className='text-gray-500 font-medium text-sm md:text-base text-center'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Your reviews will appear here once you start reviewing books
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-start p-0 gap-4 md:gap-6 w-full md:w-[1000px] ${className}`}
    >
      {/* Reviews List */}
      <div className='flex flex-col gap-4 md:gap-6 w-full md:w-[1000px]'>
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className='flex flex-col items-start p-4 md:p-5 gap-4 md:gap-5 w-full md:w-[1000px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl border-0 group relative'
          >
            {/* Date and Divider */}
            <div className='flex flex-row items-center gap-3 w-full'>
              <span
                className='font-semibold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className='w-full h-0 border border-[#D5D7DA]'></div>

            {/* Book Info */}
            <div className='flex flex-row items-center gap-3 md:gap-4 w-full min-h-[106px] md:min-h-[138px]'>
              {/* Book Cover */}
              <div className='w-[70px] md:w-[92px] h-[106px] md:h-[138px] bg-gray-100 rounded overflow-hidden flex-shrink-0'>
                {review.book.coverImage ? (
                  <img
                    src={review.book.coverImage}
                    alt={review.book.title}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs'>
                    No Image
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className='flex flex-col items-start gap-1 w-[196px] min-h-[94px] md:min-h-[100px] flex-1'>
                {/* Category */}
                <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 min-w-[78px] h-7 border border-[#D5D7DA] rounded'>
                  <span
                    className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {review.book.category?.name || 'Unknown'}
                  </span>
                </div>

                {/* Book Title */}
                <h3
                  className='w-full font-bold text-base md:text-xl leading-[30px] md:leading-[34px] tracking-[-0.02em] text-[#0A0D12] break-words'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {review.book.title}
                </h3>

                {/* Author Name */}
                <p
                  className='w-full font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#414651] break-words'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {review.book.author?.name || 'Unknown Author'}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className='w-full h-0 border border-[#D5D7DA]'></div>

            {/* Review Content */}
            <div className='flex flex-col items-start gap-2 w-full min-h-[116px] md:min-h-[92px]'>
              {/* Star Rating */}
              <div className='flex flex-row items-center gap-0.5 md:gap-1 w-[128px] h-6 md:h-[24px]'>
                {renderStars(review.star)}
              </div>

              {/* Review Comment */}
              <p
                className='w-full font-semibold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] break-words'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {review.comment}
              </p>
            </div>

            {/* Edit/Delete Buttons - Show on hover */}
            <div className='absolute top-4 md:top-5 right-4 md:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2'>
              <button
                onClick={() => {
                  console.log('Edit button clicked for review:', review);
                  onEditReview?.(review);
                }}
                className='p-1.5 md:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'
                title='Edit Review'
              >
                <Edit2 className='w-3 h-3 md:w-4 md:h-4' />
              </button>
              <button
                onClick={() => onDeleteReview?.(review.id)}
                className='p-1.5 md:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                title='Delete Review'
              >
                <Trash2 className='w-3 h-3 md:w-4 md:h-4' />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
