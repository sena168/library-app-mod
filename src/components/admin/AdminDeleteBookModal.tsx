import React from 'react';

interface AdminDeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
  isDeleting?: boolean;
}

export const AdminDeleteBookModal: React.FC<AdminDeleteBookModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookTitle: _bookTitle,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 p-4'
      onClick={onClose}
    >
      <div
        className='flex flex-col items-start p-4 gap-6 w-full max-w-[452px] min-h-[190px] bg-white rounded-2xl shadow-2xl transform transition-transform duration-200 md:p-5 md:gap-8 md:w-[452px] md:h-[190px]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className='flex flex-col items-start p-0 gap-3 w-full md:w-[412px] md:h-[74px]'>
          {/* Title */}
          <h2
            className='w-full font-bold text-lg leading-8 tracking-[-0.03em] text-[#0A0D12] md:w-[412px] md:h-8'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Delete Data
          </h2>

          {/* Description */}
          <p
            className='w-full font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] md:w-[412px] md:h-[30px]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Once deleted, you won't be able to recover this data.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-row items-center p-0 gap-3 w-full md:gap-4 md:w-[412px] md:h-11'>
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className='box-border flex flex-row justify-center items-center p-2 gap-2 flex-1 h-11 border border-[#D5D7DA] rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed md:w-[198px] md:flex-none'
          >
            <span
              className='font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Cancel
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex flex-row justify-center items-center p-2 gap-2 flex-1 h-11 bg-[#D9206E] rounded-full hover:bg-[#C01E63] disabled:opacity-50 disabled:cursor-not-allowed md:w-[198px] md:flex-none'
          >
            <span
              className='font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
