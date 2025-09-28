import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, BookOpen, Check, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store';
import { removeFromCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);

  // Load selected books from localStorage on initialization
  const loadSelectedBooksFromStorage = (): number[] => {
    try {
      const savedSelected = localStorage.getItem('library_selected_books');
      return savedSelected ? JSON.parse(savedSelected) : [];
    } catch (error) {
      console.error('Error loading selected books from localStorage:', error);
      return [];
    }
  };

  // Save selected books to localStorage
  const saveSelectedBooksToStorage = (selected: number[]) => {
    try {
      localStorage.setItem('library_selected_books', JSON.stringify(selected));
    } catch (error) {
      console.error('Error saving selected books to localStorage:', error);
    }
  };

  const [selectedBooks, setSelectedBooks] = useState<number[]>(() => {
    // Filter selected books to only include those that are still in cart
    const savedSelected = loadSelectedBooksFromStorage();
    return savedSelected.filter((id) => items.some((book) => book.id === id));
  });

  const handleRemoveFromCart = (bookId: string) => {
    dispatch(removeFromCart(bookId));
    // Remove from selected books if it was selected
    setSelectedBooks((prev) => prev.filter((id) => id !== Number(bookId)));
    saveSelectedBooksToStorage(
      selectedBooks.filter((id) => id !== Number(bookId))
    );
  };

  const handleSelectAll = () => {
    const newSelection =
      selectedBooks.length === items.length ? [] : items.map((book) => book.id);
    setSelectedBooks(newSelection);
    saveSelectedBooksToStorage(newSelection);
  };

  const handleSelectBook = (bookId: number) => {
    const newSelection = selectedBooks.includes(bookId)
      ? selectedBooks.filter((id) => id !== bookId)
      : [...selectedBooks, bookId];
    setSelectedBooks(newSelection);
    saveSelectedBooksToStorage(newSelection);
  };

  const handleProceedToCheckout = () => {
    if (selectedItemsCount === 0) {
      alert('Please select books to borrow');
      return;
    }

    // Filter cart to only selected books for checkout
    const selectedBooksForCheckout = items.filter((book) =>
      selectedBooks.includes(book.id)
    );

    // Store selected books in localStorage for checkout page
    localStorage.setItem(
      'checkout_books',
      JSON.stringify(selectedBooksForCheckout)
    );

    // Navigate to checkout
    navigate('/checkout');
  };

  // Sync selected books when cart items change (e.g., when books are removed from cart)
  useEffect(() => {
    const validSelectedBooks = selectedBooks.filter((id) =>
      items.some((book) => book.id === id)
    );
    if (validSelectedBooks.length !== selectedBooks.length) {
      setSelectedBooks(validSelectedBooks);
      saveSelectedBooksToStorage(validSelectedBooks);
    }
  }, [items, selectedBooks]);

  const selectedItemsCount = selectedBooks.length;

  if (items.length === 0) {
    return (
      <>
        <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
          <div className='max-w-[361px] md:max-w-4xl mx-auto'>
            <div className='text-center py-8 md:py-12'>
              <ShoppingCart className='h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4' />
              <h3
                className='text-base md:text-lg font-semibold mb-2'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Your cart is empty
              </h3>
              <p
                className='text-sm md:text-base text-gray-600 mb-6'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Browse our collection and add books you'd like to borrow
              </p>
              <Link to='/category'>
                <Button className='bg-[#1C65DA] hover:bg-[#1C65DA]/90 text-white w-full md:w-auto'>
                  <BookOpen className='h-4 w-4 mr-2' />
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
        <div className='max-w-[361px] md:max-w-[1000px] mx-auto'>
          {/* Main Container - Frame 116 */}
          <div className='flex flex-col items-start p-0 gap-4 md:gap-8 w-full'>
            {/* My Cart Header */}
            <h1
              className='w-full h-9 md:h-11 font-bold text-2xl md:text-4xl leading-9 md:leading-[44px] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              My Cart
            </h1>

            {/* Content Container - Frame 115 */}
            <div className='flex flex-col md:flex-row justify-center items-start p-0 gap-4 md:gap-10 w-full'>
              {/* Left Side - Book List - Frame 112 */}
              <div className='flex flex-col items-start p-0 gap-4 md:gap-6 w-full md:w-[642px] pb-20 md:pb-0'>
                {/* Select All Row - Frame 111 */}
                <div className='flex flex-row items-center p-0 gap-4 w-full'>
                  {/* Checkbox */}
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors ${
                      selectedBooks.length === items.length
                        ? 'bg-[#1C65DA] border-[#1C65DA]'
                        : 'border-[#A4A7AE] hover:border-[#1C65DA]'
                    }`}
                  >
                    {selectedBooks.length === items.length && (
                      <Check className='w-3 h-3 text-white' />
                    )}
                  </button>

                  {/* Select All Text */}
                  <span
                    className='text-base font-semibold leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Select All
                  </span>
                </div>

                {/* Book List */}
                <div className='flex flex-col items-start p-0 gap-0 w-full'>
                  {items.map((book, index) => (
                    <React.Fragment key={book.id}>
                      {/* Book Item - List Cart */}
                      <div className='group relative flex flex-row items-start p-0 gap-4 w-full h-[106px] md:h-[138px] mb-4 md:mb-6'>
                        {/* Checkbox */}
                        <button
                          onClick={() => handleSelectBook(book.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors mt-2 ${
                            selectedBooks.includes(book.id)
                              ? 'bg-[#1C65DA]'
                              : 'border border-[#A4A7AE] hover:border-[#1C65DA]'
                          }`}
                        >
                          {selectedBooks.includes(book.id) && (
                            <Check className='w-3 h-3 text-white' />
                          )}
                        </button>

                        {/* Book Content - Frame 110 */}
                        <div className='flex flex-row items-center p-0 gap-3 md:gap-4 w-[278px] md:w-[304px] h-[106px] md:h-[138px]'>
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
                                <BookOpen className='h-6 w-6 md:h-8 md:w-8 text-gray-400' />
                              </div>
                            )}
                          </div>

                          {/* Book Details - Frame 108 */}
                          <div className='flex flex-col items-start p-0 gap-1 flex-1 min-w-0 w-[196px] md:w-auto'>
                            {/* Category Badge - Frame 13 */}
                            <div className='flex flex-row justify-center items-center px-2 py-0 gap-2 h-7 border border-[#D5D7DA] rounded-md min-w-0'>
                              <span
                                className='text-sm font-bold leading-7 tracking-[-0.02em] text-[#0A0D12] whitespace-nowrap'
                                style={{ fontFamily: 'Quicksand, sans-serif' }}
                              >
                                {book.category.name}
                              </span>
                            </div>

                            {/* Book Name */}
                            <h3
                              className='font-bold text-base md:text-lg leading-[30px] md:leading-8 tracking-[-0.02em] md:tracking-[-0.03em] text-[#0A0D12] whitespace-nowrap'
                              style={{ fontFamily: 'Quicksand, sans-serif' }}
                              title={book.title}
                            >
                              <Link
                                to={`/books/${book.id}`}
                                className='hover:text-[#1C65DA] transition-colors'
                              >
                                {book.title}
                              </Link>
                            </h3>

                            {/* Author Name */}
                            <p
                              className='w-full h-[28px] md:h-[30px] font-medium text-sm md:text-base leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#414651]'
                              style={{ fontFamily: 'Quicksand, sans-serif' }}
                            >
                              by {book.author.name}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button - Trash */}
                        <button
                          onClick={() =>
                            handleRemoveFromCart(book.id.toString())
                          }
                          className='absolute top-2 right-2 w-6 h-6 text-gray-500 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10'
                          title='Remove from cart'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>

                      {/* Divider Line */}
                      {index < items.length - 1 && (
                        <div className='w-full h-0 border-t border-[#D5D7DA] mb-4 md:mb-6'></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Right Side - Loan Summary - Frame 114 (Desktop Only) */}
              <div className='hidden md:flex flex-col items-start p-4 md:p-5 gap-4 md:gap-6 w-full md:w-[318px] h-auto md:h-[200px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'>
                {/* Loan Summary Header */}
                <h2
                  className='w-full h-[34px] font-bold text-lg md:text-xl leading-[34px] tracking-[-0.02em] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Loan Summary
                </h2>

                {/* Summary Details - Frame 113 */}
                <div className='flex flex-row justify-between items-center p-0 gap-4 md:gap-[121px] w-full md:w-[253px] h-[30px]'>
                  {/* Total Book */}
                  <span
                    className='font-medium text-sm md:text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Total Book
                  </span>

                  {/* Count */}
                  <span
                    className='font-bold text-sm md:text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {selectedItemsCount} Items
                  </span>
                </div>

                {/* Borrow Button */}
                <Button
                  variant='figma-primary'
                  size='figma-mobile'
                  onClick={handleProceedToCheckout}
                  disabled={selectedItemsCount === 0}
                  className='w-full'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {selectedItemsCount === 0
                    ? 'Select Books to Borrow'
                    : `Borrow ${selectedItemsCount} Books`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Container */}
      <div className='fixed bottom-0 left-0 right-0 md:hidden z-50'>
        {/* Content Container - Figma Specs */}
        <div className='flex flex-row justify-between items-center p-4 gap-3 w-full h-[72px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
          {/* Frame 113 - Summary Details */}
          <div className='flex flex-col items-start p-0 w-[151px] h-[52px]'>
            {/* Total Book */}
            <span
              className='w-[67px] h-[28px] font-medium text-sm leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Total Book
            </span>

            {/* Count */}
            <span
              className='w-[48px] h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {selectedItemsCount} Items
            </span>
          </div>

          {/* Button */}
          <Button
            onClick={handleProceedToCheckout}
            disabled={selectedItemsCount === 0}
            className='flex flex-row justify-center items-center p-2 gap-2 w-[150px] h-[40px] bg-[#1C65DA] rounded-full'
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {/* Label */}
            <span
              className='w-[85px] h-[28px] font-bold text-sm leading-[28px] tracking-[-0.02em] text-[#FDFDFD]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {selectedItemsCount === 0
                ? 'Select Books'
                : `Borrow ${selectedItemsCount}`}
            </span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};
