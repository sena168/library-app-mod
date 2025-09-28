import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import type { Author } from '../../lib/types';

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  className = '',
}) => {
  return (
    <Link to={`/author/${author.id}`} className='block'>
      <Card
        className={`
          w-[361px] md:w-[285px] h-[84px] md:h-[113px] 
          shadow-[0px_0px_20px_rgba(203,202,202,0.25)] 
          flex-shrink-0 border-0
          hover:shadow-[0px_0px_25px_rgba(203,202,202,0.35)]
          transition-shadow duration-200 cursor-pointer
          ${className}
        `}
      >
        <CardContent className='flex flex-row items-center p-3 md:p-4 gap-3 md:gap-4 h-full'>
          {/* Author Avatar */}
          <div className='w-15 h-15 md:w-20 md:h-20 bg-gray-300 rounded-full overflow-hidden'>
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
                <span className='text-blue-600 font-bold text-lg md:text-xl'>
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className='flex flex-col items-start gap-0.5 w-[108px] md:w-[108px] h-15 md:h-16'>
            <h3
              className='w-full h-[30px] md:h-8 font-bold text-base md:text-lg leading-[30px] md:leading-8 tracking-[-0.02em] text-[#181D27] line-clamp-1'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              title={author.name}
            >
              {author.name}
            </h3>
            <div className='flex flex-row items-center gap-1.5 md:gap-1.5 w-[80px] md:w-[87px] h-[28px] md:h-[30px]'>
              <div className='w-4 h-4 md:w-6 md:h-6 flex items-center justify-center'>
                <img
                  src='/logos/book-icon.svg'
                  alt='books'
                  className='w-4 h-4 md:w-6 md:h-6'
                />
              </div>
              <span
                className='w-[50px] md:w-[57px] h-[28px] md:h-[30px] font-medium text-sm md:text-base leading-7 md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {author.bookCount} books
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
