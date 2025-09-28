import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import type { Book } from '../../lib/types';

interface BookCardProps {
  book: Book;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'mobile-recommendation';
  variant?: 'default' | 'detailed';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  className = '',
  size = 'md',
}) => {
  // Size configurations based on Figma specs
  const sizeConfig = {
    sm: {
      container: 'w-[160px] h-[320px]',
      image: 'h-[240px]',
      padding: 'p-3 gap-1',
      title: 'text-sm leading-6',
      author: 'text-xs leading-5',
      rating: 'text-xs leading-5',
      ratingContainer: 'gap-1.5',
      star: 'w-3 h-3',
      infoHeight: 'h-[80px]',
    },
    md: {
      container: 'w-[160px] md:w-[224px] h-[320px] md:h-[468px]',
      image: 'h-[240px] md:h-[336px]',
      padding: 'p-3 md:p-4 gap-1',
      title: 'text-sm md:text-lg leading-6 md:leading-8',
      author: 'text-xs md:text-base leading-5 md:leading-[30px]',
      rating: 'text-xs md:text-base leading-5 md:leading-[30px]',
      ratingContainer: 'gap-1.5 md:gap-1',
      star: 'w-3 h-3 md:w-4 md:h-4',
      infoHeight: 'h-[80px] md:h-[132px]',
    },
    lg: {
      container: 'w-[224px] h-[468px]',
      image: 'h-[336px]',
      padding: 'p-4 gap-1',
      title: 'text-lg leading-8',
      author: 'text-base leading-[30px]',
      rating: 'text-base leading-[30px]',
      ratingContainer: 'gap-1',
      star: 'w-4 h-4',
      infoHeight: 'h-[132px]',
    },
    'mobile-recommendation': {
      container: 'w-[160px] h-[340px] md:w-[224px] md:h-[468px]',
      image: 'h-[240px] md:h-[336px]',
      padding: 'p-2 md:p-4 gap-0.5 md:gap-1',
      title: 'text-xs md:text-lg leading-6 md:leading-8',
      author: 'text-xs md:text-base leading-5 md:leading-[30px]',
      rating: 'text-xs md:text-base leading-5 md:leading-[30px]',
      ratingContainer: 'gap-0.5 md:gap-1',
      star: 'w-4 h-4 md:w-4 md:h-4',
      infoHeight: 'h-[100px] md:h-[132px]',
    },
  };

  const config = sizeConfig[size];

  return (
    <Link to={`/books/${book.id}`} className='block flex-shrink-0'>
      <Card
        className={`
          flex flex-col items-start p-0
          ${config.container} 
          shadow-[0px_0px_20px_rgba(203,202,202,0.25)] 
          hover:shadow-[0px_0px_25px_rgba(203,202,202,0.35)]
          transition-shadow duration-200
          border-0
          ${className}
        `}
      >
        {/* Book Image */}
        <div
          className={`
            w-full ${config.image} 
            bg-white rounded-t-xl overflow-hidden relative group flex items-center justify-center
          `}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              onError={(e) => {
                // Hide the broken image and show placeholder
                e.currentTarget.style.display = 'none';
                const placeholder = document.getElementById(
                  `book-card-placeholder-${book.id}`
                ) as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                  placeholder.classList.remove('hidden');
                  placeholder.classList.add('flex');
                }
              }}
            />
          ) : null}
          {/* Fallback placeholder - always present but hidden when image loads successfully */}
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${
              book.coverImage ? 'hidden' : 'flex'
            }`}
            id={`book-card-placeholder-${book.id}`}
          >
            <span className='text-gray-400 text-4xl'>📚</span>
          </div>
        </div>

        {/* Book Info */}
        <CardContent
          className={`
            flex flex-col items-start justify-between
            ${config.padding} 
            w-full ${config.infoHeight}
            rounded-b-xl
            p-0 ${config.padding}
            overflow-hidden
          `}
        >
          <div className='flex flex-col items-start gap-1 w-full flex-1 min-h-0'>
            {/* Book Title */}
            <h3
              className={`
                w-full font-bold 
                ${config.title} 
                tracking-[-0.03em] text-[#181D27]
                line-clamp-1 group-hover:text-blue-600 transition-colors
                truncate
              `}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              title={book.title}
            >
              {book.title}
            </h3>

            {/* Author Name */}
            <p
              className={`
                w-full font-medium 
                ${config.author} 
                tracking-[-0.03em] text-[#414651]
                line-clamp-1
                truncate
              `}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              title={`by ${book.author.name}`}
            >
              by {book.author.name}
            </p>
          </div>

          {/* Rating */}
          <div
            className={`flex flex-row items-center ${config.ratingContainer} w-full flex-shrink-0`}
          >
            <div
              className={`${config.star} flex items-center justify-center flex-shrink-0`}
            >
              <img
                src='/logos/star-icon.svg'
                alt='star rating'
                className={`${config.star}`}
              />
            </div>
            <span
              className={`
                font-semibold 
                ${config.rating} 
                tracking-[-0.02em] text-[#181D27]
                flex-shrink-0
              `}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {book.rating.toFixed(1)}
            </span>
            {book.reviewCount > 0 && (
              <span
                className={`
                  font-medium 
                  ${config.rating} 
                  tracking-[-0.02em] text-[#414651]
                  flex-shrink-0
                `}
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                ({book.reviewCount})
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
