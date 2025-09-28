import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className='w-full bg-white border-t border-[#D5D7DA]'>
      <div className='w-full px-4 lg:px-[150px] py-20'>
        {/* Content Container */}
        <div className='flex flex-col items-center gap-10 w-full max-w-[1140px] mx-auto'>
          {/* Content */}
          <div className='flex flex-col items-center gap-[22px] w-full'>
            {/* Logo Section - Frame 37 */}
            <div className='flex items-center gap-[15px] w-[155px] h-[42px]'>
              {/* Logo */}
              <div className='w-[42px] h-[42px] flex-shrink-0'>
                <img
                  src='/logos/main-logo.svg'
                  alt='Booky Logo'
                  className='w-full h-full'
                />
              </div>

              {/* Booky Text */}
              <span
                className='w-[98px] h-[42px] font-bold text-[32px] leading-[42px] text-[#0A0D12] flex-shrink-0'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Booky
              </span>
            </div>

            {/* Description */}
            <p
              className='w-full max-w-[1140px] h-[30px] font-semibold text-base leading-[30px] text-center tracking-[-0.02em] text-[#0A0D12]'
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Your digital library companion - discover, borrow, and manage
              books with ease
            </p>
          </div>

          {/* Social Media Container */}
          <div className='flex flex-col items-start gap-5 w-[196px] h-[90px]'>
            {/* Social Media Label */}
            <div className='flex items-center gap-2 w-[196px] h-[30px]'>
              <span
                className='w-[175px] h-[30px] font-bold text-base leading-[30px] text-center text-[#0A0D12]'
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Follow Us
              </span>
            </div>

            {/* Social Media Icons */}
            <div className='flex items-center gap-3 w-[196px] h-[40px]'>
              {/* Facebook */}
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-[40px] h-[40px] border border-[#D5D7DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'
                aria-label='Follow us on Facebook'
              >
                <img
                  src='/logos/facebook-icon.svg'
                  alt='Facebook'
                  className='w-5 h-5'
                  style={{ filter: 'invert(1)' }}
                />
              </a>

              {/* Instagram */}
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-[40px] h-[40px] border border-[#D5D7DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'
                aria-label='Follow us on Instagram'
              >
                <img
                  src='/logos/instagram-icon.svg'
                  alt='Instagram'
                  className='w-5 h-5'
                  style={{ filter: 'invert(1)' }}
                />
              </a>

              {/* LinkedIn */}
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-[40px] h-[40px] border border-[#D5D7DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'
                aria-label='Follow us on LinkedIn'
              >
                <img
                  src='/logos/linkedin-icon.svg'
                  alt='LinkedIn'
                  className='w-5 h-5'
                  style={{ filter: 'invert(1)' }}
                />
              </a>

              {/* TikTok */}
              <a
                href='https://tiktok.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-[40px] h-[40px] border border-[#D5D7DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'
                aria-label='Follow us on TikTok'
              >
                <img
                  src='/logos/tiktok-icon.svg'
                  alt='TikTok'
                  className='w-5 h-5'
                  style={{ filter: 'invert(1)' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
