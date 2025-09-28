import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MoreHorizontal } from 'lucide-react';
import { useAdminBooksWithStatus } from '../../hooks/useBooks';

interface AdminBookListProps {
  onEditBook: (bookId: number) => void;
  onDeleteBook: (bookId: number) => void;
}

export const AdminBookList: React.FC<AdminBookListProps> = ({
  onEditBook,
  onDeleteBook,
}) => {
  const navigate = useNavigate();
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Use the admin books with status hook
  const {
    data: books = [],
    isLoading: bookLoading,
    error,
  } = useAdminBooksWithStatus();

  // Filter books based on search and status
  const filteredBooks = Array.isArray(books)
    ? books.filter((book) => {
        const searchQuery = bookSearchQuery.toLowerCase();
        const matchesSearch =
          book.title?.toLowerCase().includes(searchQuery) ||
          book.author?.name?.toLowerCase().includes(searchQuery) ||
          book.category?.name?.toLowerCase().includes(searchQuery) ||
          book.status?.toLowerCase().includes(searchQuery);
        const matchesStatus =
          selectedStatus === 'All' || book.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
    : [];

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle menu toggle
  const handleMenuToggle = (bookId: number) => {
    setOpenMenuId(openMenuId === bookId ? null : bookId);
  };

  // Handle menu actions
  const handlePreview = (bookId: number) => {
    navigate(`/admin/preview/${bookId}`);
    setOpenMenuId(null);
  };

  const handleEdit = (bookId: number) => {
    onEditBook(bookId);
    setOpenMenuId(null);
  };

  const handleDelete = (bookId: number) => {
    onDeleteBook(bookId);
    setOpenMenuId(null);
  };

  return (
    <div className='flex flex-col items-start p-0 gap-[15px] w-[361px] md:gap-6 md:w-full md:max-w-[1000px]'>
      {/* Header Section */}
      <div className='flex flex-col items-start p-0 gap-[15px] w-[361px] md:gap-6 md:w-full'>
        {/* Title */}
        <h2
          className='font-bold text-[24px] leading-[36px] tracking-[-0.02em] text-[#0A0D12] w-[361px] md:text-[28px] md:leading-[38px] md:w-auto'
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Book List
        </h2>

        {/* Add Book Button */}
        <button
          onClick={() => navigate('/admin/add-book')}
          className='flex flex-row justify-center items-center p-2 gap-2 w-[361px] h-11 bg-[#1C65DA] rounded-full md:w-[240px] md:h-12'
        >
          <span
            className='font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Add Book
          </span>
        </button>

        {/* Search Bar */}
        <div className='flex flex-row items-center px-4 py-2 gap-1.5 w-[361px] h-11 bg-white border border-[#D5D7DA] rounded-full md:w-full md:max-w-[600px] md:h-12'>
          <Search className='w-5 h-5 text-[#535862]' />
          <input
            type='text'
            placeholder='Search by title, author, category, or status'
            value={bookSearchQuery}
            onChange={(e) => setBookSearchQuery(e.target.value)}
            className='flex-1 h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#535862] bg-transparent border-none outline-none'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          />
        </div>

        {/* Filter Tags */}
        <div className='flex flex-row items-center p-0 gap-2 w-[361px] h-10 overflow-x-auto scrollbar-hide md:gap-3 md:w-[510px] md:overflow-visible'>
          {/* All - Active Filter */}
          <button
            onClick={() => setSelectedStatus('All')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-12 h-10 rounded-full flex-shrink-0 md:w-[51px] ${
              selectedStatus === 'All'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                selectedStatus === 'All' ? 'text-[#1C65DA]' : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              All
            </span>
          </button>

          {/* Available - Status Filter */}
          <button
            onClick={() => setSelectedStatus('Available')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[91px] h-10 rounded-full flex-shrink-0 md:w-[99px] ${
              selectedStatus === 'Available'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                selectedStatus === 'Available'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Available
            </span>
          </button>

          {/* Borrowed - Status Filter */}
          <button
            onClick={() => setSelectedStatus('Borrowed')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[96px] h-10 rounded-full flex-shrink-0 md:w-[120px] ${
              selectedStatus === 'Borrowed'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                selectedStatus === 'Borrowed'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Borrowed
            </span>
          </button>

          {/* Returned - Status Filter */}
          <button
            onClick={() => setSelectedStatus('Returned')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[93px] h-10 rounded-full flex-shrink-0 md:w-[101px] ${
              selectedStatus === 'Returned'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                selectedStatus === 'Returned'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Returned
            </span>
          </button>

          {/* Damage - Status Filter */}
          <button
            onClick={() => setSelectedStatus('Damage')}
            className={`flex flex-row justify-center items-center px-4 py-2 gap-2 w-[93px] h-10 rounded-full flex-shrink-0 md:w-[106px] ${
              selectedStatus === 'Damage'
                ? 'bg-[#F6F9FE] border border-[#1C65DA]'
                : 'border border-[#D5D7DA] hover:bg-gray-50'
            }`}
          >
            <span
              className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                selectedStatus === 'Damage'
                  ? 'text-[#1C65DA]'
                  : 'text-[#0A0D12]'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Damage
            </span>
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className='flex flex-col items-start p-0 gap-4 w-[361px] md:w-[1200px]'>
        {bookLoading ? (
          <div className='flex justify-center items-center w-full h-32'>
            <div className='text-gray-600'>Loading books...</div>
          </div>
        ) : error ? (
          <div className='flex justify-center items-center w-full h-32'>
            <div className='text-red-600'>
              Error loading books. Please try again.
            </div>
          </div>
        ) : Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className='flex flex-row justify-between items-center p-4 gap-3 w-[361px] min-h-[170px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl md:p-5 md:gap-4 md:w-[1200px] md:h-[178px]'
            >
              {/* Book Info */}
              <div className='flex flex-row items-center p-0 gap-3 flex-1 min-w-0 h-auto md:gap-4 md:h-[138px]'>
                {/* Book Image */}
                <div className='w-[92px] h-[138px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0'>
                  {book.coverImage && !book.coverImage.startsWith('blob:') ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(
                          'hidden'
                        );
                      }}
                      onLoad={(e) => {
                        // Hide the fallback div when image loads successfully
                        e.currentTarget.nextElementSibling?.classList.add(
                          'hidden'
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gray-300 flex items-center justify-center ${
                      book.coverImage && !book.coverImage.startsWith('blob:')
                        ? 'hidden'
                        : ''
                    }`}
                  >
                    <span className='text-gray-500 text-xs'>📚</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className='flex flex-col items-start p-0 gap-0.5 flex-1 min-w-0 h-auto md:gap-1 md:h-[132px]'>
                  {/* Status Badge */}
                  <div
                    className={`flex flex-row justify-center items-center px-2 py-0 gap-2 w-auto h-7 rounded-md flex-shrink-0 ${
                      book.status === 'Available'
                        ? 'bg-green-100 border border-green-300'
                        : book.status === 'Borrowed'
                        ? 'bg-red-100 border border-red-300'
                        : book.status === 'Returned'
                        ? 'bg-blue-100 border border-blue-300'
                        : book.status === 'Damage'
                        ? 'bg-orange-100 border border-orange-300'
                        : 'bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <span
                      className={`font-bold text-sm leading-7 tracking-[-0.02em] ${
                        book.status === 'Available'
                          ? 'text-green-700'
                          : book.status === 'Borrowed'
                          ? 'text-red-700'
                          : book.status === 'Returned'
                          ? 'text-blue-700'
                          : book.status === 'Damage'
                          ? 'text-orange-700'
                          : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.status}
                    </span>
                  </div>

                  {/* Book Title */}
                  <h3
                    className='w-full font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12] md:text-lg md:leading-8 md:tracking-[-0.03em] break-words'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {book.title}
                  </h3>

                  {/* Author Name */}
                  <p
                    className='w-full font-medium text-sm leading-7 tracking-[-0.03em] text-[#414651] md:text-base md:leading-[30px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {book.author?.name || 'Unknown Author'}
                  </p>

                  {/* Rating */}
                  <div className='flex flex-row items-center p-0 gap-0.5 w-[192px] h-7 md:h-[30px]'>
                    <Star className='w-6 h-6 text-[#FFAB0D] fill-current' />
                    <span
                      className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#181D27] md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.rating || '0.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className='hidden md:flex flex-row items-center p-0 gap-[13px] w-[311px] h-12 flex-shrink-0'>
                {/* Preview Button */}
                <button
                  onClick={() => navigate(`/admin/preview/${book.id}`)}
                  className='flex flex-row justify-center items-center p-2 gap-2 w-[95px] h-12 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'
                >
                  <span
                    className='w-[59px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Preview
                  </span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => onEditBook(book.id)}
                  className='flex flex-row justify-center items-center p-2 gap-2 w-[95px] h-12 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'
                >
                  <span
                    className='w-[29px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Edit
                  </span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteBook(book.id)}
                  className='flex flex-row justify-center items-center p-2 gap-2 w-[95px] h-12 border border-[#D5D7DA] rounded-full hover:bg-red-50 transition-colors'
                >
                  <span
                    className='w-[49px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#EE1D52]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Delete
                  </span>
                </button>
              </div>

              {/* More Button - Mobile */}
              <div className='flex md:hidden items-center justify-center w-6 h-6 relative self-center'>
                <button
                  onClick={() => handleMenuToggle(book.id)}
                  className='flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <MoreHorizontal className='w-6 h-6 text-[#0A0D12]' />
                </button>

                {/* Popup Menu */}
                {openMenuId === book.id && (
                  <div
                    ref={menuRef}
                    className='absolute top-8 right-0 z-50 flex flex-col items-start p-4 gap-4 w-[154px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'
                  >
                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(book.id)}
                      className='flex flex-row justify-start items-center px-0 py-2 gap-2 w-full h-10 hover:bg-gray-50 transition-colors rounded-lg'
                    >
                      <span
                        className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Preview
                      </span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(book.id)}
                      className='flex flex-row justify-start items-center px-0 py-2 gap-2 w-full h-10 hover:bg-gray-50 transition-colors rounded-lg'
                    >
                      <span
                        className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Edit
                      </span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(book.id)}
                      className='flex flex-row justify-start items-center px-0 py-2 gap-2 w-full h-10 hover:bg-red-50 transition-colors rounded-lg'
                    >
                      <span
                        className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#EE1D52]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Delete
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='flex justify-center items-center w-full h-32'>
            <p className='text-gray-600'>No books found</p>
          </div>
        )}
      </div>
    </div>
  );
};
