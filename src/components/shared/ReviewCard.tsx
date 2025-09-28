import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Review as ReviewType } from '../../lib/types';
// import { useBookDetail } from '../../hooks/useBooks';

// Extended user type for reviews with avatar
interface ReviewUser {
  id: number;
  name: string;
  avatar?: string;
}

interface ReviewCardProps {
  review: ReviewType;
  className?: string;
  onEdit?: (review: ReviewType) => void;
  onDelete?: (reviewId: number) => void;
  currentUserId?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  className = '',
  onEdit,
  onDelete,
  currentUserId,
}) => {
  // Fetch book information if bookId is provided
  // const { data: bookData } = useBookDetail(String(bookId || review.bookId));
  // const book = bookData;
  const isOwner = currentUserId === review.userId;
  const [showButtons, setShowButtons] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Get current user's profile picture from localStorage
  const getCurrentUserProfilePicture = () => {
    if (isOwner) {
      const savedProfilePicture = localStorage.getItem('userProfilePicture');
      return savedProfilePicture && savedProfilePicture.trim() !== ''
        ? savedProfilePicture
        : null;
    }
    return null;
  };

  const currentUserProfilePicture = getCurrentUserProfilePicture();
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset clicked state when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsClicked(false);
        setShowButtons(false);
      }
    };

    if (isClicked) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClicked]);

  const handleEdit = () => {
    setIsClicked(true);
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsClicked(true);
      try {
        await onDelete(review.id);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };
  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col items-start p-4 gap-4 w-full md:w-[590px] h-auto md:h-[204px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl flex-none order-0 flex-grow-1 ${className}`}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => {
        // Only hide if not hovering over buttons and not clicked
        if (!isButtonHovered && !isClicked) {
          setShowButtons(false);
        }
      }}
    >
      {/* Action Buttons - Top Right Corner */}
      {isOwner && (
        <div
          className={`absolute top-3 right-3 flex flex-row items-center gap-2 transition-opacity duration-200 ${
            showButtons || isClicked ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => {
            setIsButtonHovered(false);
            if (!isClicked) {
              setShowButtons(false);
            }
          }}
        >
          <button
            onClick={handleEdit}
            className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
            title='Edit review'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={handleDelete}
            className='p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors'
            title='Delete review'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )}

      {/* User Info - Figma Frame 26 */}
      <div className='flex flex-row items-start p-0 gap-3 w-full md:w-full md:max-w-[558px] h-16'>
        {/* User Avatar */}
        <div className='w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0'>
          {currentUserProfilePicture ? (
            <img
              src={currentUserProfilePicture}
              alt={review.user.name || ''}
              className='w-full h-full object-cover'
            />
          ) : (review.user as ReviewUser)?.avatar ? (
            <img
              src={(review.user as ReviewUser).avatar || ''}
              alt={review.user.name || ''}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-blue-100 flex items-center justify-center'>
              <span className='text-blue-600 font-bold text-xl'>
                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* User Details - Figma Frame 12 */}
        <div className='flex flex-col items-start p-0 w-full md:w-full md:max-w-[482px] h-[62px] flex-shrink-0'>
          <h3
            className='w-full h-8 font-bold text-lg leading-8 tracking-[-0.02em] text-[#0A0D12] truncate'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {review.user?.name || 'Anonymous'}
          </h3>
          <span
            className='w-full h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12] flex items-center whitespace-nowrap overflow-hidden'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {new Date(review.createdAt || '').toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Review Content - Figma Frame 27 */}
      <div className='flex flex-col items-start p-0 pl-2 gap-2 w-full md:w-[558px] h-auto md:h-[92px]'>
        {/* Star Rating */}
        <div className='flex flex-row items-center p-0 gap-1.5 w-[120px] md:w-[128px] h-6'>
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <img
              key={starIndex}
              src='/logos/star-icon.svg'
              alt='star'
              className={`w-5 h-5 md:w-6 md:h-6 ${
                starIndex < review.star ? 'opacity-100' : 'opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <p
          className='w-full h-auto md:h-[60px] font-semibold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#0A0D12] line-clamp-2 overflow-hidden'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {review.comment || 'No comment provided.'}
        </p>
      </div>
    </div>
  );
};
