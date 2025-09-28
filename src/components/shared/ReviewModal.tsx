import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import type { Review } from '../../lib/types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  onSubmit: (rating: number, comment: string) => void;
  editingReview?: Review | null;
  onUpdate?: (reviewId: number, rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bookTitle: _bookTitle,
  onSubmit,
  editingReview,
  onUpdate,
}) => {
  const { showError } = useToast();
  const [rating, setRating] = useState(editingReview?.star || 0);
  const [comment, setComment] = useState(editingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingReview;

  // Reset form when editingReview changes
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.star);
      setComment(editingReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [editingReview]);

  const handleSubmit = async () => {
    console.log('ReviewModal handleSubmit - Current state:', {
      isEditing,
      editingReview,
      rating,
      comment,
      hasOnUpdate: !!onUpdate,
      hasOnSubmit: !!onSubmit,
    });

    if (rating === 0) {
      showError('Validation Error', 'Please select a rating');
      return;
    }

    if (!comment || comment.trim().length === 0) {
      showError('Validation Error', 'Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingReview && onUpdate) {
        console.log(
          'Calling onUpdate with:',
          editingReview.id,
          rating,
          comment
        );
        await onUpdate(editingReview.id, rating, comment);
      } else {
        console.log('Calling onSubmit with:', rating, comment);
        await onSubmit(rating, comment);
      }
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      showError(
        'Submission Failed',
        `Failed to ${isEditing ? 'update' : 'submit'} review. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      {/* Modal Container - Frame 98 */}
      <div className='flex flex-col items-center p-4 md:p-6 gap-6 w-[345px] md:w-[439px] h-auto md:h-[518px] bg-white rounded-2xl relative'>
        {/* Header - Frame 96 */}
        <div className='flex flex-row justify-between items-center p-0 gap-[177px] w-[313px] md:w-[387px] h-8 md:h-9'>
          {/* Give Review Title */}
          <h2
            className='w-[99px] md:w-[139px] h-8 md:h-9 font-bold text-base md:text-2xl leading-8 md:leading-9 text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {isEditing ? 'Edit Review' : 'Give Review'}
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className='w-6 h-6 flex items-center justify-center'
          >
            <X className='w-6 h-6 text-[#0A0D12]' />
          </button>
        </div>

        {/* Rating Section - Frame 97 */}
        <div className='flex flex-col justify-center items-center p-0 w-[313px] md:w-[391px] h-[68px] md:h-[79px]'>
          {/* Give Rating Label */}
          <h3
            className='w-[313px] md:w-[391px] h-7 md:h-[30px] font-bold text-sm md:text-base leading-7 md:leading-[30px] text-center text-[#0A0D12]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Give Rating
          </h3>

          {/* Stars - Frame 25 */}
          <div className='flex flex-row justify-center items-center p-0 gap-1 w-[313px] md:w-[391px] h-10 md:h-[49px]'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className='w-10 h-10 md:w-[49px] md:h-[49px] flex items-center justify-center'
              >
                <Star
                  className={`w-5 h-5 md:w-7 md:h-7 ${
                    star <= rating ? 'text-[#FDB022]' : 'text-[#A4A7AE]'
                  }`}
                  fill={star <= rating ? '#FDB022' : '#A4A7AE'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className='flex flex-col w-[313px] md:w-[391px] h-[235px]'>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write your review here...'
            className='flex-1 w-full p-3 border border-[#D5D7DA] rounded-xl resize-none outline-none focus:border-[#1C65DA]'
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontSize: '14px',
              lineHeight: '28px',
              fontWeight: '500',
              letterSpacing: '-0.03em',
              color: comment ? '#0A0D12' : '#717680',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className='flex flex-row justify-center items-center p-2 gap-2 w-[313px] md:w-[391px] h-10 md:h-12 bg-[#1C65DA] rounded-full hover:bg-[#1557C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <span
            className='font-bold text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {isSubmitting
              ? isEditing
                ? 'Updating...'
                : 'Submitting...'
              : isEditing
              ? 'Update'
              : 'Submit'}
          </span>
        </button>
      </div>
    </div>
  );
};
