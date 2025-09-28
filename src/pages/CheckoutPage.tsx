import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check } from 'lucide-react';
import { useAppDispatch } from '../store';
import { removeFromCart } from '../store/slices/cartSlice';
import { useBorrowBook } from '../hooks/useBooks';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const borrowMutation = useBorrowBook();

  // Get selected books from localStorage (set by CartPage)
  const [selectedBooks, setSelectedBooks] = useState<
    Array<{
      id: number;
      title: string;
      coverImage?: string;
      category: { name: string };
      author: { name: string };
    }>
  >([]);

  useEffect(() => {
    const checkoutBooks = localStorage.getItem('checkout_books');
    if (checkoutBooks) {
      setSelectedBooks(JSON.parse(checkoutBooks));
    } else {
      // If no checkout books, redirect to cart
      navigate('/cart');
    }
  }, [navigate]);

  // Get user from localStorage (same as in Navbar)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Form states
  const [borrowDate, setBorrowDate] = useState('');
  const [borrowDuration, setBorrowDuration] = useState(3); // Default to 3 days
  const [agreeToReturn, setAgreeToReturn] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Calculate return date
  const getReturnDate = () => {
    if (!borrowDate) return '';
    const date = new Date(borrowDate);
    date.setDate(date.getDate() + borrowDuration);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Set default borrow date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBorrowDate(today);
  }, []);

  const handleBorrowAll = async () => {
    if (!agreeToReturn || !acceptPolicy) {
      alert('Please agree to the terms and conditions');
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const book of selectedBooks) {
      try {
        await borrowMutation.mutateAsync({
          bookId: book.id,
          days: borrowDuration,
        });
        successCount++;
      } catch (error: unknown) {
        console.error('Error borrowing book:', error);
        errorCount++;

        // Extract error message
        const errorMessage =
          (error as { message?: string })?.message ||
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          'Unknown error';
        errors.push(`${book.title}: ${errorMessage}`);
      }
    }

    // Show results to user
    if (errorCount === 0) {
      // All books borrowed successfully - navigate directly without popup
      // Remove borrowed books from cart
      selectedBooks.forEach((book) => {
        dispatch(removeFromCart(book.id.toString()));
      });

      // Clear localStorage
      localStorage.removeItem('library_selected_books');
      localStorage.removeItem('checkout_books');

      navigate('/success-borrow');
    } else if (successCount > 0) {
      // Some books borrowed successfully
      alert(
        `Successfully borrowed ${successCount} book(s), but ${errorCount} failed:\n\n${errors.join(
          '\n'
        )}`
      );
    } else {
      // All books failed
      alert(`Failed to borrow all books:\n\n${errors.join('\n')}`);
    }
  };

  if (selectedBooks.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-4 md:p-8 overflow-x-hidden'>
        {/* Main Container - Frame 128 */}
        <div className='max-w-[361px] md:max-w-[1002px] mx-auto w-full'>
          <div className='flex flex-col justify-center items-start p-0 gap-6 md:gap-8 w-full'>
            {/* Checkout Header */}
            <h1
              className='w-full h-9 md:h-11 font-bold text-2xl md:text-4xl leading-9 md:leading-[44px] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Checkout
            </h1>

            {/* Content Container - Frame 127 */}
            <div className='flex flex-col md:flex-row justify-center items-start p-0 gap-4 md:gap-[58px] w-full'>
              {/* Left Side - User Info & Book List - Frame 127 */}
              <div className='flex flex-col items-start p-0 gap-4 md:gap-8 w-full md:w-[466px]'>
                {/* User Information Section - Frame 126 */}
                <div className='flex flex-col items-start p-0 gap-4 w-full'>
                  <h2
                    className='w-auto h-auto md:h-auto font-bold text-lg md:text-2xl leading-8 md:leading-9 tracking-[-0.03em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    User Information
                  </h2>

                  {/* User Details */}
                  <div className='flex flex-col gap-2 md:gap-4 w-full'>
                    {/* Name - Frame 53 */}
                    <div className='flex flex-row justify-between items-center p-0 gap-4 md:gap-[135px] w-full min-h-[30px]'>
                      <span
                        className='h-auto font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#0A0D12] flex-shrink-0'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Name
                      </span>
                      <span
                        className='h-auto font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate flex-1 min-w-0 text-right'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {user?.name || 'Johndoe'}
                      </span>
                    </div>

                    {/* Email - Frame 54 */}
                    <div className='flex flex-row justify-between items-center p-0 gap-4 md:gap-[135px] w-full min-h-[30px]'>
                      <span
                        className='h-auto font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#0A0D12] flex-shrink-0'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Email
                      </span>
                      <span
                        className='h-auto font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate flex-1 min-w-0 text-right'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {user?.email || 'johndoe@email.com'}
                      </span>
                    </div>

                    {/* Phone - Frame 55 */}
                    <div className='flex flex-row justify-between items-center p-0 gap-4 md:gap-[135px] w-full min-h-[30px]'>
                      <span
                        className='h-auto font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#0A0D12] flex-shrink-0'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Nomor Handphone
                      </span>
                      <span
                        className='h-auto font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] truncate flex-1 min-w-0 text-right'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        081234567890
                      </span>
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div className='w-full h-0 border-t border-[#D5D7DA]'></div>
                </div>

                {/* Book List Section - Frame 125 */}
                <div className='flex flex-col items-start p-0 gap-4 w-full'>
                  <h2
                    className='w-full h-8 md:h-9 font-bold text-lg md:text-2xl leading-8 md:leading-9 tracking-[-0.03em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Book List
                  </h2>

                  {/* Books */}
                  <div className='flex flex-col gap-2 md:gap-4 w-full'>
                    {selectedBooks.map((book) => (
                      <div
                        key={book.id}
                        className='flex flex-row items-center p-0 gap-3 md:gap-4 w-full max-w-[278px] md:max-w-none h-[106px] md:h-[138px]'
                      >
                        {/* Book Image */}
                        <div className='w-[70px] h-[106px] md:w-[92px] md:h-[138px] flex-shrink-0'>
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-gray-200 rounded flex items-center justify-center'>
                              <span className='text-gray-400 text-lg'>📚</span>
                            </div>
                          )}
                        </div>

                        {/* Book Details - Frame 108 */}
                        <div className='flex flex-col items-start p-0 gap-1 flex-1 min-w-0 h-auto md:h-auto'>
                          {/* Category Badge - Frame 13 */}
                          <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 w-auto h-7 border border-[#D5D7DA] rounded-md'>
                            <span
                              className='font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap'
                              style={{ fontFamily: 'Quicksand, sans-serif' }}
                            >
                              {book.category.name}
                            </span>
                          </div>

                          {/* Book Name */}
                          <h3
                            className='w-full font-bold text-base md:text-xl leading-[30px] md:leading-[34px] tracking-[-0.02em] text-[#0A0D12] truncate'
                            style={{ fontFamily: 'Quicksand, sans-serif' }}
                            title={book.title}
                          >
                            {book.title}
                          </h3>

                          {/* Author Name */}
                          <p
                            className='w-full font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#414651] truncate'
                            style={{ fontFamily: 'Quicksand, sans-serif' }}
                          >
                            by {book.author.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Checkout Form - Frame 123 */}
              <div className='flex flex-col items-start p-4 md:p-5 gap-4 md:gap-6 w-full md:w-[478px] h-auto md:h-auto bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-[20px]'>
                {/* Form Header */}
                <h2
                  className='w-full md:w-[410px] h-[34px] md:h-[38px] font-bold text-xl md:text-[28px] leading-[34px] md:leading-[38px] tracking-[-0.02em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Complete Your Borrow Request
                </h2>

                {/* Borrow Date Input Field */}
                <div className='flex flex-col items-start p-0 gap-0.5 w-full bg-white'>
                  <label
                    className='w-full h-7 font-bold text-sm leading-7 tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Borrow Date
                  </label>
                  <div className='flex flex-row items-center px-4 py-2 gap-2 w-full h-12 bg-[#F5F5F5] border border-[#D5D7DA] rounded-xl relative'>
                    {/* Hidden date input for functionality */}
                    <input
                      type='date'
                      id='borrow-date'
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    {/* Custom formatted date display */}
                    <span className='flex-1 h-[30px] font-semibold text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] flex items-center'>
                      {formatDisplayDate(borrowDate)}
                    </span>
                    <Calendar
                      className='w-5 h-5 text-[#0A0D12] cursor-pointer'
                      onClick={() => {
                        const dateInput = document.getElementById(
                          'borrow-date'
                        ) as HTMLInputElement;
                        dateInput?.showPicker();
                      }}
                    />
                  </div>
                </div>

                {/* Borrow Duration - Frame 121 */}
                <div className='flex flex-col items-start p-0 gap-3 w-full'>
                  <h3
                    className='w-full h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Borrow Duration
                  </h3>

                  {/* Duration Options */}
                  <div className='flex flex-col gap-2'>
                    {/* 3 Days - Frame 118 */}
                    <div className='flex flex-row items-center p-0 gap-2 w-[76px] h-[28px]'>
                      <button
                        onClick={() => setBorrowDuration(3)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          borrowDuration === 3
                            ? 'bg-[#1C65DA]'
                            : 'border border-[#A4A7AE]'
                        }`}
                      >
                        {borrowDuration === 3 && (
                          <div className='w-3 h-3 bg-white rounded-full'></div>
                        )}
                      </button>
                      <span
                        className='w-[44px] h-[28px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        3 Days
                      </span>
                    </div>

                    {/* 5 Days - Frame 119 */}
                    <div className='flex flex-row items-center p-0 gap-2 w-[76px] h-[28px]'>
                      <button
                        onClick={() => setBorrowDuration(5)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          borrowDuration === 5
                            ? 'bg-[#1C65DA]'
                            : 'border border-[#A4A7AE]'
                        }`}
                      >
                        {borrowDuration === 5 && (
                          <div className='w-3 h-3 bg-white rounded-full'></div>
                        )}
                      </button>
                      <span
                        className='w-[44px] h-[28px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        5 Days
                      </span>
                    </div>

                    {/* 10 Days - Frame 120 */}
                    <div className='flex flex-row items-center p-0 gap-2 w-[82px] h-[28px]'>
                      <button
                        onClick={() => setBorrowDuration(10)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          borrowDuration === 10
                            ? 'bg-[#1C65DA]'
                            : 'border border-[#A4A7AE]'
                        }`}
                      >
                        {borrowDuration === 10 && (
                          <div className='w-3 h-3 bg-white rounded-full'></div>
                        )}
                      </button>
                      <span
                        className='w-[50px] h-[28px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        10 Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Return Date Info - Frame 122 */}
                <div className='flex flex-col items-start p-3 md:p-4 w-full bg-[#F6F9FE] rounded-xl'>
                  <h3
                    className='w-full h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Return Date
                  </h3>
                  <p
                    className='w-full h-[59px] font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Please return the book no later than{' '}
                    <span className='text-red-600 font-bold'>
                      {getReturnDate()}
                    </span>
                  </p>
                </div>

                {/* Agreement Checkboxes - Frame 117 */}
                <div className='flex flex-col items-start p-0 gap-2 w-full'>
                  {/* First Agreement - Frame 111 */}
                  <div className='flex flex-row items-center p-0 gap-2 w-full h-[56px]'>
                    <button
                      onClick={() => setAgreeToReturn(!agreeToReturn)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        agreeToReturn
                          ? 'bg-[#1C65DA]'
                          : 'border border-[#A4A7AE]'
                      }`}
                    >
                      {agreeToReturn && (
                        <Check className='w-3 h-3 text-white' />
                      )}
                    </button>
                    <span
                      className='w-[301px] h-[56px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      I agree to return the book(s) before the due date.
                    </span>
                  </div>

                  {/* Second Agreement - Frame 112 */}
                  <div className='flex flex-row items-center p-0 gap-2 w-[271px] h-[28px]'>
                    <button
                      onClick={() => setAcceptPolicy(!acceptPolicy)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        acceptPolicy
                          ? 'bg-[#1C65DA]'
                          : 'border border-[#A4A7AE]'
                      }`}
                    >
                      {acceptPolicy && <Check className='w-3 h-3 text-white' />}
                    </button>
                    <span
                      className='w-[243px] h-[28px] font-semibold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      I accept the library borrowing policy.
                    </span>
                  </div>
                </div>

                {/* Borrow Button */}
                <Button
                  variant='figma-primary'
                  size='figma-mobile'
                  onClick={handleBorrowAll}
                  disabled={
                    !agreeToReturn || !acceptPolicy || borrowMutation.isPending
                  }
                  className='w-full h-12 bg-[#1C65DA] rounded-full'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  <span className='w-[135px] h-[30px] font-bold text-base leading-[30px] tracking-[-0.02em] text-[#FDFDFD]'>
                    {borrowMutation.isPending
                      ? 'Processing...'
                      : `Confirm & Borrow ${selectedBooks.length} Books`}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};
