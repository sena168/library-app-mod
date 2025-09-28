import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { useAllBooks } from '../hooks/useBooks';
import { BookCard } from '../components/shared/BookCard';
import type { Book } from '../lib/types';

export const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: allBooks, isLoading, error } = useAllBooks();

  // Filter books by author ID
  const authorBooks =
    allBooks?.filter((book: Book) => book.authorId === parseInt(id!)) || [];
  const author = authorBooks.length > 0 ? authorBooks[0].author : null;

  // Handle error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Error Loading Author
          </h1>
          <p className='text-gray-600 mb-8'>
            There was an error loading the author data.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          {/* Main Content Container */}
          <div className='flex flex-col gap-4 md:gap-10 w-full max-w-[361px] md:max-w-none mx-auto md:mx-0'>
            {/* Author Card Skeleton */}
            <div className='bg-white rounded-2xl shadow-sm p-3 md:p-4 animate-pulse'>
              <div className='flex items-center gap-3 md:gap-4'>
                <div className='w-[60px] h-[60px] md:w-20 md:h-20 bg-gray-300 rounded-full'></div>
                <div className='flex-1'>
                  <div className='h-[30px] md:h-6 bg-gray-300 rounded mb-2 w-32 md:w-48'></div>
                  <div className='h-[28px] md:h-5 bg-gray-300 rounded w-24 md:w-32'></div>
                </div>
              </div>
            </div>

            {/* Books Grid Skeleton */}
            <div className='flex flex-col gap-4 md:gap-8 w-full'>
              <div className='h-9 md:h-8 bg-gray-300 rounded w-32 md:w-48'></div>
              <div className='flex flex-row flex-wrap gap-4 md:grid md:grid-cols-5 md:gap-5'>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-xl shadow-sm p-4 animate-pulse w-[172px] h-[390px] md:w-[224px] md:h-[468px]'
                  >
                    <div className='bg-gray-300 h-[258px] md:h-64 rounded mb-4'></div>
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

  if (!author) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Author Not Found
          </h1>
          <p className='text-gray-600 mb-8'>
            The author you're looking for doesn't exist.
          </p>
          <Link
            to='/'
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          {/* Main Content Container */}
          <div className='flex flex-col gap-4 md:gap-10 w-full max-w-[361px] md:max-w-none mx-auto md:mx-0'>
            {/* Author Card */}
            <div className='flex flex-row items-center p-3 md:p-4 gap-3 md:gap-4 w-full h-[84px] md:h-[113px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-2xl'>
              {/* Author Avatar */}
              <div className='w-[60px] h-[60px] md:w-[81px] md:h-[81px] bg-gray-200 rounded-full overflow-hidden flex-shrink-0'>
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 font-bold text-lg md:text-2xl'>
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className='flex flex-col items-start gap-0.5 md:gap-0.5 flex-1 h-[60px] md:h-16'>
                {/* Author Name */}
                <h1
                  className='w-full h-[30px] md:h-8 font-bold text-base md:text-lg leading-[30px] md:leading-8 tracking-[-0.02em] md:tracking-[-0.03em] text-[#181D27]'
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {author.name}
                </h1>

                {/* Book Count */}
                <div className='flex flex-row items-center gap-1.5 md:gap-1.5 h-[28px] md:h-[30px]'>
                  {/* Book Icon */}
                  <img
                    src='/logos/book-icon.svg'
                    alt='book'
                    className='w-6 h-6 md:w-6 md:h-6'
                  />
                  {/* Book Count */}
                  <span
                    className='h-[28px] md:h-[30px] font-medium text-sm md:text-base leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {authorBooks.length} books
                  </span>
                </div>
              </div>
            </div>

            {/* Books Section */}
            <div className='flex flex-col items-start gap-4 md:gap-8 w-full'>
              {/* Book List Title */}
              <h2
                className='w-full h-9 md:h-11 font-bold text-2xl md:text-4xl leading-9 md:leading-[44px] tracking-[-0.02em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Book List
              </h2>

              {/* Books Grid */}
              <div className='flex flex-row flex-wrap gap-4 md:grid md:grid-cols-5 md:gap-5 w-full'>
                {authorBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    size='mobile-recommendation'
                    className='overflow-hidden group flex-shrink-0'
                  />
                ))}
              </div>

              {/* No Books Message */}
              {authorBooks.length === 0 && (
                <div className='text-center py-12'>
                  <p className='text-gray-500 text-lg'>
                    No books found for this author.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
