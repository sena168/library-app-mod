import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { BookCard } from '../components/shared/BookCard';
import { AuthorCard } from '../components/shared/AuthorCard';
import { useAllBooks, usePopularAuthors } from '../hooks/useBooks';

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  const [searchQuery, setSearchQueryState] = useState('');
  const isSearchingRef = useRef<boolean>(false);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAuthenticated = !!user;

  // Get search query from URL parameters
  const urlSearchQuery = searchParams.get('search') || '';

  // Use TanStack Query for fetching all books with search (no limit to get all available books)
  const {
    data: allBooksData = [],
    isLoading: booksLoading,
    error: booksError,
  } = useAllBooks(searchQuery);

  // Fetch popular authors
  const {
    data: popularAuthors = [],
    isLoading: authorsLoading,
    error: authorsError,
  } = usePopularAuthors(10);

  // Apply display limit to the fetched books
  const allBooks = allBooksData.slice(0, displayLimit);
  const hasMoreBooks = allBooksData.length > displayLimit;

  // Handle load more functionality
  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  // Sync search query state with URL and preserve scroll position
  useEffect(() => {
    // Save scroll position before updating search query
    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      scrollPositionRef.current = currentScrollY;
    }

    // Set searching flag to prevent scroll reset
    isSearchingRef.current = true;

    setSearchQueryState(urlSearchQuery);

    // Restore scroll position after search query updates (both when searching and clearing)
    if (scrollPositionRef.current > 0) {
      // Use multiple restoration attempts with different timing
      const restoreScroll = () => {
        if (scrollPositionRef.current > 0) {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant',
          });
        }
      };

      // Immediate restoration
      restoreScroll();

      // Delayed restorations to handle DOM changes
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
      setTimeout(restoreScroll, 200);
      setTimeout(restoreScroll, 500);
    }

    // Clear searching flag after restoration attempts
    setTimeout(() => {
      isSearchingRef.current = false;
    }, 600);
  }, [urlSearchQuery]);

  // Listen for popstate events from navbar search
  useEffect(() => {
    const handlePopState = () => {
      // Save current scroll position before updating search
      scrollPositionRef.current = window.scrollY;

      const urlParams = new URLSearchParams(window.location.search);
      const newSearchQuery = urlParams.get('search') || '';
      setSearchQueryState(newSearchQuery);
      setSearchParams(new URLSearchParams(window.location.search));

      // Restore scroll position after a brief delay to ensure DOM updates
      setTimeout(() => {
        if (scrollPositionRef.current > 0) {
          window.scrollTo(0, scrollPositionRef.current);
        }
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setSearchParams]);

  // Reset display limit when search query changes and preserve scroll position
  useEffect(() => {
    // Save scroll position before any changes
    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      scrollPositionRef.current = currentScrollY;
    }

    setDisplayLimit(10);

    // Preserve scroll position when search results update (both when searching and clearing)
    if (scrollPositionRef.current > 0) {
      // If we have a saved scroll position, restore it
      // Use multiple attempts to ensure scroll position is preserved
      const restoreScroll = () => {
        if (scrollPositionRef.current > 0) {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant',
          });
        }
      };

      // Try multiple times with different delays to handle DOM changes
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 150);
      setTimeout(restoreScroll, 300);
      setTimeout(restoreScroll, 500);
      setTimeout(restoreScroll, 1000);
    }
  }, [searchQuery]);

  // Preserve scroll position during search updates
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Save current scroll position continuously and prevent unwanted scroll resets
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    // Prevent scroll reset during search
    const preventScrollReset = (e: Event) => {
      if (isSearchingRef.current && scrollPositionRef.current > 0) {
        // If we're searching and scroll position jumps to top, restore it
        if (window.scrollY < 100) {
          e.preventDefault();
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', preventScrollReset, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', preventScrollReset);
    };
  }, []);

  // Watch for DOM changes and restore scroll position
  useEffect(() => {
    if (searchQuery !== '') {
      const observer = new MutationObserver(() => {
        // When DOM changes, restore scroll position immediately
        if (scrollPositionRef.current > 0) {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant',
          });
        }
      });

      // Observe changes to the main content
      const mainContent = document.querySelector('main') || document.body;
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      // Also add a scroll event listener to prevent unwanted scrolling
      const preventScrollReset = (e: Event) => {
        if (
          scrollPositionRef.current > 0 &&
          window.scrollY < scrollPositionRef.current - 100
        ) {
          e.preventDefault();
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant',
          });
        }
      };

      window.addEventListener('scroll', preventScrollReset, { passive: false });

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', preventScrollReset);
      };
    }
  }, [searchQuery]);

  // Additional scroll position preservation for search updates
  useEffect(() => {
    const handleScrollPreservation = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 0) {
        scrollPositionRef.current = currentScrollY;
      }
    };

    // Save scroll position before any search-related updates
    handleScrollPreservation();

    // Force scroll restoration after search results update (both when searching and clearing)
    if (scrollPositionRef.current > 0) {
      const forceScrollRestore = () => {
        if (scrollPositionRef.current > 0) {
          window.scrollTo(0, scrollPositionRef.current);
        }
      };

      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        forceScrollRestore();
        setTimeout(forceScrollRestore, 100);
        setTimeout(forceScrollRestore, 250);
      });
    }

    return () => {
      // Ensure we save the final scroll position
      handleScrollPreservation();
    };
  }, [searchQuery]);

  // Category mapping for navigation
  const categoryMapping: { [key: string]: number } = {
    Fiction: 1,
    'Non-Fiction': 2,
    'Self-Improvement': 3,
    Finance: 4,
    Science: 5,
    Education: 6,
  };

  // Mock slides data - you can replace this with real data
  const slides = [
    { id: 1, image: '/images/hero-image.png', title: 'Welcome to Booky' },
    { id: 2, image: '/images/hero-image.png', title: 'Discover Amazing Books' },
    {
      id: 3,
      image: '/images/hero-image.png',
      title: 'Start Your Reading Journey',
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(autoSlide);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Drag handlers for touch/mouse
  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging) return;

    const diffX = startX - clientX;
    const threshold = 50; // Minimum drag distance to trigger slide change

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - next slide
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // Swipe right - previous slide
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  // Show loading state for all users when fetching books
  if (booksLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-[1200px] mx-auto'>
          <div className='animate-pulse space-y-8'>
            <div className='bg-gray-300 h-12 rounded w-1/3'></div>
            <div className='bg-gray-300 h-64 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for all users if books fetch fails
  if (booksError) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-[1200px] mx-auto'>
          <div className='text-center py-8'>
            <h2 className='text-xl font-semibold text-red-600 mb-4'>
              Failed to load books
            </h2>
            <p className='text-gray-600'>
              There was an error loading the book recommendations. Please try
              again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show different content based on authentication
  if (!isAuthenticated) {
    return (
      <>
        <div className='w-full'>
          {/* Main Container */}
          <div className='flex flex-col items-start gap-8 md:gap-12 w-full max-w-[1200px] mx-auto px-4 lg:px-0 pt-4 md:pt-8 pb-12 md:pb-16'>
            {/* Hero Banner Section */}
            <div className='flex flex-col justify-center items-center gap-4 w-full h-[300px] md:h-[467px]'>
              {/* Banner Slider */}
              <div
                className='relative w-full h-[280px] md:h-[441px] rounded-2xl md:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Slides Container */}
                <div
                  className='flex transition-transform duration-500 ease-in-out h-full'
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide) => (
                    <div
                      key={slide.id}
                      className='w-full h-full flex-shrink-0 relative'
                    >
                      {/* Hero Image */}
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className='w-full h-full object-cover select-none'
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots - Positioned under the banner */}
              <div className='flex items-center justify-center gap-1.5 mt-2'>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? 'bg-[#1C65DA]'
                        : 'bg-[#D5D7DA] hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className='grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5 w-full h-auto'>
              {/* Category Cards */}
              {[
                { name: 'Fiction', icon: '/logos/fiction-icon.svg' },
                { name: 'Non-Fiction', icon: '/logos/nonfiction-icon.svg' },
                {
                  name: 'Self-Improvement',
                  icon: '/logos/selfimprovement-icon.svg',
                },
                { name: 'Finance', icon: '/logos/finance-icon.svg' },
                {
                  name: 'Science',
                  icon: '/logos/science-icon.svg',
                },
                {
                  name: 'Education',
                  icon: '/logos/education-icon.svg',
                },
              ].map((category, index) => (
                <Link
                  key={index}
                  to={`/category?category=${categoryMapping[category.name]}`}
                  className='block'
                >
                  <div className='flex flex-col justify-center items-center p-2 md:p-3 gap-2 md:gap-3 w-full h-[100px] md:h-[130px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl md:rounded-2xl hover:shadow-[0px_0px_25px_rgba(203,202,202,0.35)] transition-shadow duration-200 cursor-pointer'>
                    <div className='flex justify-center items-center p-1 md:p-1.5 w-full h-12 md:h-16 bg-[#E0ECFF] rounded-lg md:rounded-xl'>
                      <img
                        src={category.icon}
                        alt={category.name}
                        className='w-8 h-8 md:w-12 md:h-12'
                      />
                    </div>
                    <div className='w-full h-[24px] md:h-[30px] flex items-center justify-start'>
                      <span
                        className='font-semibold text-xs md:text-sm leading-[20px] md:leading-[24px] tracking-[-0.02em] text-[#0A0D12] text-left'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recommendation Section */}
            <div className='flex flex-col justify-center items-center gap-6 md:gap-10 w-full'>
              {/* Section Title */}
              <div className='w-full'>
                <h2
                  className='w-full h-8 md:h-11 font-bold text-2xl md:text-4xl leading-8 md:leading-[44px] text-[#0A0D12]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : 'Recommendation'}
                </h2>
                {searchQuery && (
                  <p
                    className='text-sm md:text-base text-[#414651] mt-2'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Found {allBooks.length} book
                    {allBooks.length !== 1 ? 's' : ''} matching your search
                  </p>
                )}
              </div>

              {/* Book Grid */}
              <div className='flex flex-col items-start gap-4 md:gap-5 w-full'>
                {allBooks.length > 0 ? (
                  <>
                    {/* First Row */}
                    <div className='flex flex-row flex-wrap items-center gap-3 md:gap-5 w-full h-auto md:h-[468px]'>
                      {allBooks.slice(0, 5).map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          size='lg'
                          variant='detailed'
                          className='book-card overflow-hidden group'
                        />
                      ))}
                    </div>

                    {/* Second Row - only show if there are more than 5 books */}
                    {allBooks.length > 5 && (
                      <div className='flex flex-row flex-wrap items-center gap-3 md:gap-5 w-full h-auto md:h-[468px]'>
                        {allBooks.slice(5, 10).map((book) => (
                          <BookCard
                            key={book.id}
                            book={book}
                            size='lg'
                            variant='detailed'
                            className='book-card overflow-hidden group'
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center py-12 w-full'>
                    <div className='text-6xl mb-4'>📚</div>
                    <h3
                      className='text-xl md:text-2xl font-bold text-[#0A0D12] mb-2'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {searchQuery ? 'No books found' : 'No books available'}
                    </h3>
                    <p
                      className='text-sm md:text-base text-[#414651] text-center'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {searchQuery
                        ? `Try searching for different keywords or browse our categories.`
                        : 'Check back later for new book recommendations.'}
                    </p>
                    {searchQuery && (
                      <Link to='/' className='mt-4'>
                        <Button
                          variant='figma-primary'
                          size='figma'
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          Browse All Books
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Load More Button */}
                {allBooks.length > 0 && hasMoreBooks && (
                  <div className='flex justify-center w-full pt-3 md:pt-5'>
                    <Button
                      variant='figma-outline'
                      size='figma'
                      className='w-[160px] md:w-[200px] h-10 md:h-12 font-bold'
                      style={{
                        fontFamily: 'Quicksand, sans-serif',
                        fontWeight: 'bold',
                      }}
                      onClick={handleLoadMore}
                    >
                      Load More
                    </Button>
                  </div>
                )}

                {/* Divider */}
                <div className='w-full h-px border border-[#D5D7DA]'></div>
              </div>
            </div>

            {/* Popular Authors Section */}
            <div className='flex flex-col items-start gap-6 md:gap-10 w-full h-auto'>
              {/* Section Title */}
              <h2
                className='w-full h-8 md:h-11 font-bold text-2xl md:text-4xl leading-8 md:leading-[44px] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Popular Authors
              </h2>

              {/* Author Cards */}
              <div className='flex flex-row items-center gap-3 md:gap-5 w-full h-auto overflow-x-auto'>
                {authorsLoading ? (
                  // Loading skeleton for author cards
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center p-3 md:p-4 gap-3 md:gap-4 w-[220px] md:w-[285px] h-[90px] md:h-[113px] bg-gray-200 rounded-xl flex-shrink-0 animate-pulse'
                    >
                      <div className='w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full'></div>
                      <div className='flex flex-col gap-2'>
                        <div className='w-24 h-4 bg-gray-300 rounded'></div>
                        <div className='w-16 h-3 bg-gray-300 rounded'></div>
                      </div>
                    </div>
                  ))
                ) : authorsError ? (
                  <div className='flex items-center justify-center w-full h-[113px] text-gray-500'>
                    <p>Failed to load authors</p>
                  </div>
                ) : (
                  popularAuthors.map((author) => (
                    <AuthorCard key={author.id} author={author} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer for unauthenticated users - Full width outside container */}
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className='w-full'>
        {/* Main Container */}
        <div className='flex flex-col items-start gap-8 md:gap-12 w-full max-w-[1200px] mx-auto px-4 lg:px-0 pt-4 md:pt-8 pb-12 md:pb-16'>
          {/* Hero Banner Section */}
          <div className='flex flex-col justify-center items-center gap-4 w-full h-[300px] md:h-[467px]'>
            {/* Banner Slider */}
            <div
              className='relative w-full h-[280px] md:h-[441px] rounded-2xl md:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing'
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides Container */}
              <div
                className='flex transition-transform duration-500 ease-in-out h-full'
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className='w-full h-full flex-shrink-0 relative'
                  >
                    {/* Hero Image */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className='w-full h-full object-cover select-none'
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots - Positioned under the banner */}
            <div className='flex items-center justify-center gap-1.5 mt-2'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-[#1C65DA]'
                      : 'bg-[#D5D7DA] hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className='grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5 w-full h-auto'>
            {/* Category Cards */}
            {[
              { name: 'Fiction', icon: '/logos/fiction-icon.svg' },
              { name: 'Non-Fiction', icon: '/logos/nonfiction-icon.svg' },
              {
                name: 'Self-Improvement',
                icon: '/logos/selfimprovement-icon.svg',
              },
              { name: 'Finance', icon: '/logos/finance-icon.svg' },
              { name: 'Science', icon: '/logos/science-icon.svg' },
              {
                name: 'Education',
                icon: '/logos/education-icon.svg',
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/category?category=${categoryMapping[category.name]}`}
                className='block'
              >
                <div className='flex flex-col justify-center items-center p-2 md:p-3 gap-2 md:gap-3 w-full h-[100px] md:h-[130px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl md:rounded-2xl hover:shadow-[0px_0px_25px_rgba(203,202,202,0.35)] transition-shadow duration-200 cursor-pointer'>
                  <div className='flex justify-center items-center p-1 md:p-1.5 w-full h-12 md:h-16 bg-[#E0ECFF] rounded-lg md:rounded-xl'>
                    <img
                      src={category.icon}
                      alt={category.name}
                      className='w-8 h-8 md:w-12 md:h-12'
                    />
                  </div>
                  <div className='w-full h-[24px] md:h-[30px] flex items-center justify-start'>
                    <span
                      className='font-semibold text-xs md:text-sm leading-[20px] md:leading-[24px] tracking-[-0.02em] text-[#0A0D12] text-left'
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recommendation Section */}
          <div className='flex flex-col justify-center items-center gap-6 md:gap-10 w-full'>
            {/* Section Title */}
            <div className='w-full'>
              <h2
                className='w-full h-8 md:h-11 font-bold text-2xl md:text-4xl leading-8 md:leading-[44px] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'Recommendation'}
              </h2>
              {searchQuery && (
                <p
                  className='text-sm md:text-base text-[#414651] mt-2'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Found {allBooks.length} book{allBooks.length !== 1 ? 's' : ''}{' '}
                  matching your search
                </p>
              )}
            </div>

            {/* Book Grid */}
            <div className='flex flex-col items-start gap-4 md:gap-5 w-full'>
              {allBooks.length > 0 ? (
                <>
                  {/* Mobile: 2 rows with 2 books each, Desktop: 2 rows with 5 books each */}
                  {/* Use CSS Grid for better control */}
                  <div className='grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 w-full'>
                    {allBooks.map((book, index) => (
                      <div
                        key={book.id}
                        className={`${index < 10 ? 'block' : 'hidden'}`}
                      >
                        <BookCard
                          book={book}
                          size='mobile-recommendation'
                          variant='detailed'
                          className='book-card overflow-hidden group'
                        />
                      </div>
                    ))}
                  </div>

                  {/* Third Row - only show on desktop if there are more than 10 books */}
                  {allBooks.length > 10 && (
                    <div className='hidden md:flex flex-row flex-wrap items-center gap-5 w-full h-auto md:h-[468px]'>
                      {allBooks.slice(10, 15).map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          size='lg'
                          variant='detailed'
                          className='book-card overflow-hidden group'
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 w-full'>
                  <div className='text-6xl mb-4'>📚</div>
                  <h3
                    className='text-xl md:text-2xl font-bold text-[#0A0D12] mb-2'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {searchQuery ? 'No books found' : 'No books available'}
                  </h3>
                  <p
                    className='text-sm md:text-base text-[#414651] text-center'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {searchQuery
                      ? `Try searching for different keywords or browse our categories.`
                      : 'Check back later for new book recommendations.'}
                  </p>
                  {searchQuery && (
                    <Link to='/' className='mt-4'>
                      <Button
                        variant='figma-primary'
                        size='figma'
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Browse All Books
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Load More Button */}
              {allBooks.length > 0 && hasMoreBooks && (
                <div className='flex justify-center w-full pt-3 md:pt-5'>
                  <Button
                    variant='figma-outline'
                    size='figma'
                    className='w-[160px] md:w-[200px] h-10 md:h-12 font-bold'
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: 'bold',
                    }}
                    onClick={handleLoadMore}
                  >
                    Load More
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className='w-full h-px border border-[#D5D7DA]'></div>
            </div>
          </div>

          {/* Popular Authors Section */}
          <div className='flex flex-col items-start gap-6 md:gap-10 w-full h-auto'>
            {/* Section Title */}
            <h2
              className='w-full h-8 md:h-11 font-bold text-2xl md:text-4xl leading-8 md:leading-[44px] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Popular Authors
            </h2>

            {/* Author Cards - Mobile: vertical scroll, Desktop: 4 cards in row */}
            <div className='flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full h-[400px] md:h-auto overflow-y-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
              {authorsLoading ? (
                // Loading skeleton for author cards
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex flex-row items-center p-3 md:p-4 gap-3 md:gap-4 w-[361px] md:w-[285px] h-[84px] md:h-[113px] bg-gray-200 rounded-xl flex-shrink-0 animate-pulse'
                  >
                    <div className='w-15 h-15 md:w-20 md:h-20 bg-gray-300 rounded-full'></div>
                    <div className='flex flex-col gap-2'>
                      <div className='w-24 h-4 bg-gray-300 rounded'></div>
                      <div className='w-16 h-3 bg-gray-300 rounded'></div>
                    </div>
                  </div>
                ))
              ) : authorsError ? (
                <div className='flex items-center justify-center w-full h-[113px] text-gray-500'>
                  <p>Failed to load authors</p>
                </div>
              ) : (
                popularAuthors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer for authenticated users - Full width outside container */}
      <Footer />
    </>
  );
};
