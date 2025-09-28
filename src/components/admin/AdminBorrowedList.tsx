import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface BorrowedBook {
  id: number;
  book: {
    id: number;
    title: string;
    author: {
      name: string;
    };
    category: {
      name: string;
    };
    coverImage?: string;
  };
  user: {
    name: string;
  };
  status: 'active' | 'overdue' | 'returned';
  borrowedAt?: string;
  dueAt: string;
  returnedAt?: string;
}

interface AdminBorrowedListProps {
  borrowedBooks: unknown[];
  loading?: boolean;
}

export const AdminBorrowedList: React.FC<AdminBorrowedListProps> = ({
  borrowedBooks = [],
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'Active' | 'Overdue' | 'Returned'
  >('All');

  // Filter books based on search and status
  const filteredBooks = (borrowedBooks as BorrowedBook[]).filter(
    (loan: BorrowedBook) => {
      const matchesSearch =
        loan?.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan?.book?.author?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        loan?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilter === 'All' ||
        (selectedFilter === 'Active' && loan?.status === 'active') ||
        (selectedFilter === 'Overdue' && loan?.status === 'overdue') ||
        (selectedFilter === 'Returned' && loan?.status === 'returned');

      return matchesSearch && matchesFilter;
    }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateDuration = (borrowedAt: string | undefined, dueAt: string) => {
    if (!borrowedAt) return 'N/A';
    const borrowed = new Date(borrowedAt);
    const due = new Date(dueAt);
    const diffTime = due.getTime() - borrowed.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-600';
      case 'overdue':
        return 'bg-red-50 text-red-600';
      case 'returned':
        return 'bg-gray-50 text-gray-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'overdue':
        return 'Overdue';
      case 'returned':
        return 'Returned';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-32'>
        <div className='text-gray-600'>Loading borrowed books...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start p-0 gap-6 w-full max-w-[1200px] md:gap-6 gap-[15px] md:max-w-[1200px] max-w-[361px]'>
      {/* Header Section */}
      <div className='flex flex-col items-start p-0 gap-6 w-full md:gap-6 gap-[15px]'>
        {/* Title */}
        <h2
          className='w-[600px] h-[38px] font-bold text-[28px] leading-[38px] tracking-[-0.03em] text-[#0A0D12] md:w-[600px] md:h-[38px] md:text-[28px] md:leading-[38px] w-full h-[36px] text-[24px] leading-[36px]'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Borrowed List
        </h2>

        {/* Search Bar */}
        <div className='flex flex-row items-center px-4 py-2 gap-1.5 w-[600px] h-12 bg-white border border-[#D5D7DA] rounded-full md:w-[600px] md:h-12 md:px-4 md:py-2 w-full h-[44px] px-4 py-2'>
          <Search className='w-5 h-5 text-[#535862] md:w-5 md:h-5 w-5 h-5' />
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none md:h-7 md:text-sm md:leading-7 h-7 text-sm leading-7'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          />
        </div>

        {/* Filter Tags */}
        <div className='flex flex-row items-center p-0 gap-3 w-[361px] h-10 md:w-[361px] md:h-10 w-full h-10'>
          {/* All - Active Filter */}
          <button
            onClick={() => setSelectedFilter('All')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[51px] h-10 rounded-full ${
              selectedFilter === 'All'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-[19px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] ${
                selectedFilter === 'All' ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              All
            </span>
          </button>

          {/* Active - Inactive Filter */}
          <button
            onClick={() => setSelectedFilter('Active')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[77px] h-10 rounded-full ${
              selectedFilter === 'Active'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-[45px] h-[30px] font-semibold text-base leading-[30px] tracking-[-0.02em] ${
                selectedFilter === 'Active'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Active
            </span>
          </button>

          {/* Overdue - Inactive Filter */}
          <button
            onClick={() => setSelectedFilter('Overdue')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[101px] h-10 rounded-full ${
              selectedFilter === 'Overdue'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-[69px] h-[30px] font-semibold text-base leading-[30px] tracking-[-0.02em] ${
                selectedFilter === 'Overdue'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Overdue
            </span>
          </button>

          {/* Returned - Inactive Filter */}
          <button
            onClick={() => setSelectedFilter('Returned')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[96px] h-10 rounded-full ${
              selectedFilter === 'Returned'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-[64px] h-[30px] font-semibold text-base leading-[30px] tracking-[-0.02em] ${
                selectedFilter === 'Returned'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Returned
            </span>
          </button>
        </div>
      </div>

      {/* Borrowed Books List */}
      <div className='flex flex-col items-start p-0 gap-4 w-[361px] md:w-[1200px]'>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((loan: BorrowedBook) => (
            <div
              key={loan.id}
              className='flex flex-col items-start p-4 gap-4 w-[361px] h-[454px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl md:w-[1200px] md:h-[250px] md:p-5 md:gap-5'
            >
              {/* Header Row */}
              <div className='flex flex-row justify-between items-start p-0 gap-2 w-[329px] h-[32px] md:w-[1160px] md:h-8'>
                {/* Status */}
                <div className='flex flex-row items-center p-0 gap-2 w-[111px] h-[32px] md:w-[117px] md:h-8'>
                  <span
                    className='w-[43px] h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] md:w-[49px] md:h-[30px] md:text-base md:leading-[30px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Status
                  </span>
                  <div
                    className={`flex flex-row justify-center items-center px-2 py-1 gap-2 min-w-[56px] h-[32px] rounded ${getStatusColor(
                      loan.status
                    )} md:px-4 md:py-2 md:min-w-[70px] md:h-8`}
                  >
                    <span
                      className='font-bold text-sm leading-[28px] tracking-[-0.02em] whitespace-nowrap md:leading-6'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {getStatusText(loan.status)}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div className='flex flex-row items-center p-0 gap-2 w-[220px] h-[32px] md:w-[250px] md:h-8'>
                  <span
                    className='w-[62px] h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] md:w-[70px] md:h-[30px] md:text-base md:leading-[30px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Due Date
                  </span>
                  <div className='flex flex-row justify-center items-center px-2 py-1 gap-2 min-w-[120px] h-[32px] bg-red-50 rounded md:px-4 md:py-2 md:min-w-[160px] md:h-8'>
                    <span
                      className='font-bold text-sm leading-[28px] tracking-[-0.02em] text-red-600 whitespace-nowrap md:leading-6'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {formatDate(loan.dueAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className='w-[329px] h-0 border border-[#D5D7DA] md:w-[1160px]' />

              {/* Book Details Row */}
              <div className='flex flex-col justify-center items-start p-0 gap-3 w-[329px] h-[358px] md:flex-row md:justify-between md:items-center md:gap-4 md:w-[1160px] md:h-[138px]'>
                {/* Book Info */}
                <div className='flex flex-col justify-center items-start p-0 gap-3 w-[329px] h-[358px] md:flex-row md:items-center md:gap-4 md:flex-1 md:min-w-0 md:h-[138px]'>
                  {/* Book Image */}
                  <div className='w-[92px] h-[138px] bg-gray-200 rounded-lg overflow-hidden'>
                    {loan.book.coverImage &&
                    !loan.book.coverImage.startsWith('blob:') ? (
                      <img
                        src={loan.book.coverImage}
                        alt={loan.book.title}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove(
                            'hidden'
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gray-300 flex items-center justify-center ${
                        loan.book.coverImage &&
                        !loan.book.coverImage.startsWith('blob:')
                          ? 'hidden'
                          : ''
                      }`}
                    >
                      <span className='text-gray-500 text-xs'>📚</span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className='flex flex-col items-start p-0 gap-1 w-[196px] h-[126px] md:flex-1 md:min-w-0 md:h-[134px]'>
                    {/* Category Badge */}
                    <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 min-w-[78px] h-[28px] border border-[#D5D7DA] rounded-md md:px-3 md:py-1 md:min-w-[80px] md:h-7'>
                      <span
                        className='h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap md:h-7 md:leading-7'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {loan.book.category?.name || 'Uncategorized'}
                      </span>
                    </div>

                    {/* Book Title */}
                    <h3
                      className='w-[196px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] truncate md:w-full md:h-[34px] md:text-xl md:leading-[34px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {loan.book.title}
                    </h3>

                    {/* Author Name */}
                    <p
                      className='w-[196px] h-[28px] font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#414651] truncate md:w-full md:h-[30px] md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {loan.book.author?.name || 'Unknown Author'}
                    </p>

                    {/* Borrowed Date and Duration */}
                    <div className='flex flex-row items-center p-0 gap-2 w-[203px] h-[28px] md:w-full md:h-[30px]'>
                      <span
                        className='h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap md:h-[30px] md:text-base md:leading-[30px]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {loan.borrowedAt ? formatDate(loan.borrowedAt) : 'N/A'}
                      </span>
                      <div className='w-0.5 h-0.5 bg-[#0A0D12] rounded-full flex-shrink-0 md:w-0.5 md:h-0.5 w-0.5 h-0.5' />
                      <span
                        className='h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap md:h-[30px] md:text-base md:leading-[30px]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Duration{' '}
                        {calculateDuration(loan.borrowedAt, loan.dueAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Divider Line */}
                <div className='w-full h-0 border border-[#D5D7DA] md:hidden' />

                {/* Borrower Info */}
                <div className='flex flex-col justify-center items-start p-0 w-[110px] h-[58px] md:w-[126px] md:h-16 md:flex-shrink-0'>
                  <span
                    className='w-full h-[28px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate md:w-full md:h-[30px] md:text-base md:leading-[30px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    borrower's name
                  </span>
                  <span
                    className='w-full h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] truncate md:w-full md:h-[34px] md:text-xl md:leading-[34px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {loan.user?.name || 'Unknown User'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex flex-col justify-center items-center w-full h-32 gap-2'>
            <p className='text-gray-600 font-medium'>No overdue books found</p>
            <p className='text-gray-500 text-sm text-center max-w-md'>
              Currently there are no overdue loans. The system only displays
              overdue books from the available API data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
