import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2 } from 'lucide-react';
import { useBookDetail } from '../hooks/useBooks';
import { AdminHeader } from '../components/admin/AdminHeader';

// Define Book interface locally to avoid import issues
interface Book {
  id: number;
  title: string;
  description?: string;
  isbn: string;
  publishedYear: number;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  pages?: number;
  authorId: number;
  categoryId: number;
  author: {
    id: number;
    name: string;
    bio?: string;
    avatar?: string;
    bookCount?: number;
  };
  category: {
    id: number;
    name: string;
    description?: string;
  };
  reviews?: Array<{
    id: number;
    star: number;
    comment?: string;
    userId: number;
    bookId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const AdminPreviewBookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Use the existing useBookDetail hook
  const { data: bookData, isLoading, error } = useBookDetail(bookId || '');

  useEffect(() => {
    if (bookData) {
      setBook(bookData as Book);
      setLoading(false);
    } else if (error) {
      setLoading(false);
    }
  }, [bookData, error]);

  useEffect(() => {
    // Check if user is admin and get admin data
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check for admin role or specific admin email
    const isAdmin =
      user &&
      (user.role === 'admin' ||
        user.role === 'ADMIN' ||
        user.email === 'admin@library.local');

    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    // Store admin user data
    setAdminUser({
      name: user.name || 'Admin',
      email: user.email,
    });
  }, [navigate]);

  const handleBack = () => {
    navigate('/admin?tab=books');
  };

  if (loading || isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-screen'>
        <div className='text-gray-600'>Loading book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className='flex justify-center items-center w-full h-screen'>
        <div className='text-red-600'>Error loading book details</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <AdminHeader adminName={adminUser?.name || 'Admin'} />

      {/* Main Content */}
      <div className='w-full max-w-[1200px] mx-auto px-4 py-8 md:px-[120px]'>
        {/* Header with Back Button */}
        <div className='flex flex-col items-start p-0 gap-6 w-[364px] md:gap-8 md:w-full'>
          {/* Back Button and Title */}
          <div className='flex flex-row items-center p-0 gap-1.5 w-[364px] h-[34px] md:gap-3 md:w-[217px] md:h-[38px]'>
            {/* Arrow */}
            <button
              onClick={handleBack}
              className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors md:w-8 md:h-8'
            >
              <ArrowLeft className='w-6 h-6 text-[#1E1E1E] md:w-5 md:h-5' />
            </button>

            {/* Preview Book */}
            <span
              className='w-[126px] h-[34px] font-bold text-xl leading-[34px] tracking-[-0.02em] text-[#0A0D12] md:w-[173px] md:h-[38px] md:text-[28px] md:leading-[38px] md:tracking-[-0.03em]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Preview Book
            </span>
          </div>

          {/* Book Details */}
          <div className='flex flex-col items-start p-0 gap-4 w-[364px] md:gap-6 md:w-full'>
            <div className='flex flex-col items-center p-0 gap-9 w-[364px] md:flex-row md:w-full'>
              {/* Book Image */}
              <div className='flex flex-row items-center p-[5.29px] gap-[5.29px] w-[222.75px] h-[328.83px] bg-[#E9EAEB] md:p-2 md:gap-2 md:w-[337px] md:h-[498px]'>
                <div className='w-[212.18px] h-[318.26px] bg-gray-200 rounded-lg overflow-hidden md:w-[321px] md:h-[482px]'>
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
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gray-300 flex items-center justify-center ${
                      book.coverImage && !book.coverImage.startsWith('blob:')
                        ? 'hidden'
                        : ''
                    }`}
                  >
                    <span className='text-gray-500 text-4xl'>📚</span>
                  </div>
                </div>
              </div>

              {/* Book Information */}
              <div className='flex flex-col items-start p-0 gap-4 w-[364px] md:gap-5 md:flex-1 md:min-w-0'>
                {/* Basic Info */}
                <div className='flex flex-col items-start p-0 gap-3 w-[364px] md:gap-[22px] md:w-full'>
                  {/* Title Section */}
                  <div className='flex flex-col items-start p-0 gap-0.5 w-[364px] md:gap-1 md:w-full md:max-w-[500px]'>
                    {/* Category Badge */}
                    <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 w-[158px] h-7 border border-[#D5D7DA] rounded-md'>
                      <span
                        className='w-[142px] h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {book.category?.name || 'Uncategorized'}
                      </span>
                    </div>

                    {/* Book Title */}
                    <h1
                      className='w-[364px] h-9 font-bold text-2xl leading-9 tracking-[-0.02em] text-[#0A0D12] md:w-full md:h-auto md:text-[28px] md:leading-[38px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.title}
                    </h1>

                    {/* Author Name */}
                    <p
                      className='w-[364px] h-7 font-semibold text-sm leading-7 tracking-[-0.02em] text-[#414651] md:w-full md:h-auto md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.author?.name || 'Unknown Author'}
                    </p>

                    {/* Rating */}
                    <div className='flex flex-row items-center p-0 gap-0.5 w-[192px] h-[30px]'>
                      <Star className='w-6 h-6 text-[#FFAB0D] fill-current' />
                      <span
                        className='w-[22px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#181D27]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {book.rating || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className='flex flex-row items-center p-0 gap-5 w-[364px] h-[60px] md:gap-5 md:w-full md:h-[66px]'>
                  {/* Pages */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] flex-1 md:w-[102px] md:h-[66px] md:flex-none'>
                    <span
                      className='w-[94.67px] h-8 font-bold text-lg leading-8 text-[#0A0D12] md:w-[102px] md:h-9 md:text-2xl md:leading-9'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.pages || '320'}
                    </span>
                    <span
                      className='w-[94.67px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#0A0D12] md:w-[102px] md:h-[30px] md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Page
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className='w-0 h-[60px] border-l border-[#D5D7DA] md:h-[66px]'></div>

                  {/* Rating */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] flex-1 md:w-[102px] md:h-[66px] md:flex-none'>
                    <span
                      className='w-[94.67px] h-8 font-bold text-lg leading-8 text-[#0A0D12] md:w-[102px] md:h-9 md:text-2xl md:leading-9'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.rating || '4.9'}
                    </span>
                    <span
                      className='w-[94.67px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#0A0D12] md:w-[102px] md:h-[30px] md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Rating
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className='w-0 h-[60px] border-l border-[#D5D7DA] md:h-[66px]'></div>

                  {/* Reviews */}
                  <div className='flex flex-col items-start p-0 w-[94.67px] h-[60px] flex-1 md:w-[102px] md:h-[66px] md:flex-none'>
                    <span
                      className='w-[94.67px] h-8 font-bold text-lg leading-8 text-[#0A0D12] md:w-[102px] md:h-9 md:text-2xl md:leading-9'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {book.reviews?.length || '179'}
                    </span>
                    <span
                      className='w-[94.67px] h-7 font-medium text-sm leading-7 tracking-[-0.03em] text-[#0A0D12] md:w-[102px] md:h-[30px] md:text-base md:leading-[30px]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Reviews
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className='flex flex-col items-start p-0 gap-1 w-[364px] md:w-full'>
                  <h3
                    className='w-[364px] h-[34px] font-bold text-xl leading-[34px] tracking-[-0.02em] text-[#0A0D12] md:w-full md:h-auto'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Description
                  </h3>
                  <p
                    className='w-[364px] h-[168px] font-medium text-sm leading-7 tracking-[-0.03em] text-[#0A0D12] md:w-full md:h-auto md:text-base md:leading-[30px]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {book.description ||
                      'No description available for this book.'}
                  </p>
                </div>

                {/* Action Buttons - Hidden on Mobile */}
                <div className='hidden md:flex flex-row items-start p-0 gap-3 w-[468px] h-12'>
                  {/* Edit Button */}
                  <button className='flex flex-row justify-center items-center p-2 gap-2 w-[200px] h-12 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'>
                    <span
                      className='w-[87px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Edit Book
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button className='flex flex-row justify-center items-center p-2 gap-2 w-[200px] h-12 bg-[#1C65DA] rounded-full hover:bg-blue-700 transition-colors'>
                    <span
                      className='w-[98px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Delete Book
                    </span>
                  </button>

                  {/* Share Button */}
                  <button className='flex flex-row justify-center items-center p-3 px-4 gap-3 w-11 h-11 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'>
                    <Share2 className='w-5 h-5 text-[#0A0D12]' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons - Mobile Only */}
      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[393px] h-[72px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:hidden'>
        <div className='flex flex-row items-start p-4 gap-3 w-full h-full'>
          {/* Add to Cart Button */}
          <button className='flex flex-row justify-center items-center p-2 flex-1 h-10 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'>
            <span
              className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Add to Cart
            </span>
          </button>

          {/* Borrow Book Button */}
          <button className='flex flex-row justify-center items-center p-2 flex-1 h-10 bg-[#1C65DA] rounded-full hover:bg-blue-700 transition-colors'>
            <span
              className='font-bold text-sm leading-7 tracking-[-0.02em] text-[#FDFDFD]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Borrow Book
            </span>
          </button>

          {/* Share Button */}
          <button className='flex flex-row justify-center items-center p-2 gap-2 w-10 h-10 border border-[#D5D7DA] rounded-full hover:bg-gray-50 transition-colors'>
            <Share2 className='w-4 h-4 text-[#0A0D12]' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPreviewBookPage;
