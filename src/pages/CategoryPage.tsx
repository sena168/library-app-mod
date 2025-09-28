import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { BookCard } from '../components/shared/BookCard';
import { X, ListFilter } from 'lucide-react';
import type { Book } from '../lib/types';

interface Category {
  id: number;
  name: string;
}

export const CategoryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [initialCategoryApplied, setInitialCategoryApplied] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock categories data - in real app this would come from API
  const categories: Category[] = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Self-Improvement' },
    { id: 4, name: 'Finance & Business' },
    { id: 5, name: 'Science & Technology' },
    { id: 6, name: 'Education & Reference' },
  ];

  const ratings = [5, 4, 3, 2, 1];

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for search changes from navbar
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search') || '';
      setSearchQuery(searchParam);
    };

    // Set initial search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search') || '';
    setSearchQuery(initialSearch);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle initial category selection from URL (only once on mount)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !initialCategoryApplied) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategories([categoryId]);
      }
      setInitialCategoryApplied(true);
    }
  }, [searchParams, initialCategoryApplied]);

  // Handle search query updates from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        'https://belibraryformentee-production.up.railway.app/api/books'
      );
      const data = await response.json();
      setBooks(data.data?.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const filteredBooks = books.filter((book) => {
    // Search filter
    const searchMatch =
      searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(book.categoryId);

    // Rating filter
    const ratingMatch =
      selectedRatings.length === 0 ||
      selectedRatings.some((rating) => {
        if (rating === 5) {
          return book.rating >= 5.0;
        } else {
          return book.rating >= rating && book.rating < rating + 1;
        }
      });

    return searchMatch && categoryMatch && ratingMatch;
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='flex gap-10'>
            {/* Sidebar skeleton */}
            <div className='w-64 bg-white rounded-xl shadow-sm p-4 animate-pulse'>
              <div className='h-6 bg-gray-300 rounded mb-4'></div>
              <div className='space-y-3'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='h-5 bg-gray-300 rounded'></div>
                ))}
              </div>
            </div>
            {/* Books grid skeleton */}
            <div className='flex-1'>
              <div className='h-8 bg-gray-300 rounded mb-8 w-48'></div>
              <div className='grid grid-cols-4 gap-5'>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-xl shadow-sm p-4 animate-pulse'
                  >
                    <div className='bg-gray-300 h-64 rounded mb-4'></div>
                    <div className='bg-gray-300 h-4 rounded mb-2'></div>
                    <div className='bg-gray-300 h-3 rounded w-2/3'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          {/* Main Content Container */}
          <div className='flex flex-col gap-8'>
            {/* Book List Title */}
            <div className='flex flex-col gap-4'>
              <h1
                className='text-2xl md:text-4xl font-bold text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Book List
              </h1>

              {/* Mobile Filter Bar */}
              <div className='md:hidden flex flex-row justify-between items-center p-3 w-full max-w-[361px] h-[52px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl'>
                {/* Filter Title */}
                <span
                  className='text-sm font-extrabold text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Filter
                </span>

                {/* Filter Icon */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className='w-5 h-5 flex items-center justify-center'
                >
                  <ListFilter className='w-5 h-5 text-[#0A0D12]' />
                </button>
              </div>
              {(searchQuery ||
                selectedCategories.length > 0 ||
                selectedRatings.length > 0) && (
                <div className='flex flex-col gap-1'>
                  {searchQuery && (
                    <p className='text-lg text-gray-600'>
                      Search results for:{' '}
                      <span className='font-semibold text-[#1C65DA]'>
                        "{searchQuery}"
                      </span>
                    </p>
                  )}
                  {(selectedCategories.length > 0 ||
                    selectedRatings.length > 0) && (
                    <p className='text-sm text-gray-500'>
                      Active filters:{' '}
                      {selectedCategories.length > 0 && (
                        <span className='font-medium'>
                          {selectedCategories.length} categor
                          {selectedCategories.length === 1 ? 'y' : 'ies'}
                        </span>
                      )}
                      {selectedCategories.length > 0 &&
                        selectedRatings.length > 0 &&
                        ', '}
                      {selectedRatings.length > 0 && (
                        <span className='font-medium'>
                          {selectedRatings.length} rating
                          {selectedRatings.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </p>
                  )}
                  {filteredBooks.length > 0 && (
                    <p className='text-sm text-gray-500'>
                      ({filteredBooks.length} book
                      {filteredBooks.length !== 1 ? 's' : ''} found)
                    </p>
                  )}
                  {(searchQuery ||
                    selectedCategories.length > 0 ||
                    selectedRatings.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                        setSelectedRatings([]);
                        // Clear URL parameters
                        const currentUrl = new URL(window.location.href);
                        currentUrl.searchParams.delete('search');
                        currentUrl.searchParams.delete('category');
                        window.history.replaceState(
                          null,
                          '',
                          currentUrl.toString()
                        );
                      }}
                      className='text-sm text-[#1C65DA] hover:text-[#0F4CB8] underline mt-1 self-start'
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content with Sidebar and Books Grid */}
            <div className='flex flex-row gap-10'>
              {/* Desktop Sidebar - Categories Container */}
              <div className='hidden md:flex flex-col items-start py-4 gap-6 w-[266px] h-[664px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl'>
                {/* Filter Section */}
                <div className='flex flex-col items-start px-4 gap-2.5 w-[266px]'>
                  {/* Filter Title */}
                  <h3
                    className='w-[234px] h-[30px] font-bold text-base leading-[30px] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Filter
                  </h3>

                  {/* Categories Title */}
                  <h4
                    className='w-[234px] h-8 font-bold text-lg leading-8 tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Categories
                  </h4>

                  {/* Category Options */}
                  <div className='flex flex-col gap-0 w-[234px]'>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className='flex flex-row items-center gap-2 w-[234px] h-[30px]'
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`w-5 h-5 rounded-md border ${
                            selectedCategories.includes(category.id)
                              ? 'bg-[#1C65DA] border-[#1C65DA]'
                              : 'border-[#A4A7AE]'
                          } flex items-center justify-center`}
                        >
                          {selectedCategories.includes(category.id) && (
                            <svg
                              className='w-3 h-3 text-white'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          )}
                        </button>

                        {/* Category Name */}
                        <span
                          className='w-[206px] h-[30px] font-medium text-base leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider Line */}
                <div className='w-[266px] h-0 border border-[#D5D7DA]'></div>

                {/* Rating Container */}
                <div className='flex flex-col items-center px-4 gap-2.5 w-[266px]'>
                  {/* Rating Title */}
                  <h4
                    className='w-[234px] h-8 font-bold text-lg leading-8 tracking-[-0.02em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Rating
                  </h4>

                  {/* Rating Options Container */}
                  <div className='flex flex-col items-start w-[234px]'>
                    {ratings.map((rating) => (
                      <div
                        key={rating}
                        className='flex flex-col items-start p-2 gap-2 w-[234px] h-[46px]'
                      >
                        {/* Rating Checkbox Container */}
                        <div className='flex flex-row items-center gap-2'>
                          {/* Checkbox */}
                          <button
                            onClick={() => handleRatingToggle(rating)}
                            className={`w-5 h-5 rounded-md border ${
                              selectedRatings.includes(rating)
                                ? 'bg-[#1C65DA] border-[#1C65DA]'
                                : 'border-[#A4A7AE]'
                            } flex items-center justify-center`}
                          >
                            {selectedRatings.includes(rating) && (
                              <svg
                                className='w-3 h-3 text-white'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            )}
                          </button>

                          {/* Rating Star Container */}
                          <div className='flex flex-row items-center gap-0.5'>
                            {/* Star Icon */}
                            <img
                              src='/logos/star-icon.svg'
                              alt='star'
                              className='w-6 h-6'
                            />
                            {/* Rating Value */}
                            <span
                              className='font-normal text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12]'
                              style={{ fontFamily: 'Quicksand, sans-serif' }}
                            >
                              {rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Books Grid Container */}
              <div className='flex flex-col gap-4 md:gap-6 w-full md:w-[879px]'>
                {/* Mobile Books Grid - 2 columns */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-20 w-full'>
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      size='mobile-recommendation'
                      className='overflow-hidden group flex-shrink-0'
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* No Results Message */}
            {filteredBooks.length === 0 && !loading && (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>
                  No books found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Slide-out Sidebar */}
        {isMobileSidebarOpen && (
          <>
            {/* Sidebar */}
            <div className='fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out'>
              <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='flex flex-row justify-between items-center px-3 py-3 border-b border-[#D5D7DA]'>
                  <h2
                    className='text-base font-bold text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Filter
                  </h2>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className='p-1.5 hover:bg-gray-100 rounded-lg'
                  >
                    <X className='w-4 h-4 text-[#0A0D12]' />
                  </button>
                </div>

                {/* Filter Content */}
                <div className='flex-1 overflow-y-auto px-3 py-4'>
                  {/* Categories Section */}
                  <div className='mb-6'>
                    <h3
                      className='text-sm font-bold text-[#0A0D12] mb-3'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Categories
                    </h3>
                    <div className='space-y-2'>
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className='flex items-center gap-2'
                        >
                          <button
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`w-4 h-4 rounded-sm border ${
                              selectedCategories.includes(category.id)
                                ? 'bg-[#1C65DA] border-[#1C65DA]'
                                : 'border-[#A4A7AE]'
                            } flex items-center justify-center`}
                          >
                            {selectedCategories.includes(category.id) && (
                              <svg
                                className='w-2.5 h-2.5 text-white'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            )}
                          </button>
                          <span
                            className='text-sm font-medium text-[#0A0D12]'
                            style={{ fontFamily: 'Quicksand, sans-serif' }}
                          >
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div>
                    <h3
                      className='text-sm font-bold text-[#0A0D12] mb-3'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      Rating
                    </h3>
                    <div className='space-y-2'>
                      {ratings.map((rating) => (
                        <div key={rating} className='flex items-center gap-2'>
                          <button
                            onClick={() => handleRatingToggle(rating)}
                            className={`w-4 h-4 rounded-sm border ${
                              selectedRatings.includes(rating)
                                ? 'bg-[#1C65DA] border-[#1C65DA]'
                                : 'border-[#A4A7AE]'
                            } flex items-center justify-center`}
                          >
                            {selectedRatings.includes(rating) && (
                              <svg
                                className='w-2.5 h-2.5 text-white'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            )}
                          </button>
                          <div className='flex items-center gap-1'>
                            <img
                              src='/logos/star-icon.svg'
                              alt='star'
                              className='w-4 h-4'
                            />
                            <span
                              className='text-sm text-[#0A0D12]'
                              style={{ fontFamily: 'Quicksand, sans-serif' }}
                            >
                              {rating}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className='p-3 border-t border-[#D5D7DA]'>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedRatings([]);
                      setIsMobileSidebarOpen(false);
                    }}
                    className='w-full py-2.5 px-3 bg-[#1C65DA] text-white rounded-lg text-sm font-semibold hover:bg-[#0F4CB8] transition-colors'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};
